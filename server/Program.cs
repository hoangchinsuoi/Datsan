using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Datsan.Server.Application.Abstractions;
using Datsan.Server.Application.Services;
using Datsan.Server.Core.Configuration;
using Datsan.Server.Helpers;
using Datsan.Server.Infrastructure.Data;
using Datsan.Server.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));

var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
    ?? throw new InvalidOperationException("Jwt configuration is missing.");

var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = signingKey,
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Datsan API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Bearer. Ví dụ: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
            },
            Array.Empty<string>()
        },
    });
    var xml = Path.Combine(AppContext.BaseDirectory, $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml");
    if (File.Exists(xml))
        c.IncludeXmlComments(xml);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            // Đọc danh sách origins từ biến môi trường FRONTEND_URL (set trên Render)
            var frontendUrl = builder.Configuration["FRONTEND_URL"] 
                              ?? Environment.GetEnvironmentVariable("FRONTEND_URL")
                              ?? "http://localhost:3000";
            
            var allowedOrigins = frontendUrl.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// Hỗ trợ tự động parse định dạng postgresql:// từ Render một cách an toàn hơn
if (connectionString.StartsWith("postgres://") || connectionString.StartsWith("postgresql://"))
{
    try 
    {
        var uri = new Uri(connectionString);
        var db = uri.AbsolutePath.TrimStart('/');
        var userPass = uri.UserInfo.Split(':');
        var user = userPass[0];
        var pass = userPass.Length > 1 ? Uri.UnescapeDataString(userPass[1]) : "";
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        
        connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={pass};SSL Mode=Prefer;Trust Server Certificate=true;Include Error Detail=true";
        Console.WriteLine($"[Database] Đang kết nối tới host: {host}:{port}, Database: {db}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Database] Lỗi khi parse connection string: {ex.Message}");
    }
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFieldRepository, FieldRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<FieldService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<ChatService>();
builder.Services.AddScoped<VnpayService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddHttpClient<AiChatService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var db = services.GetRequiredService<AppDbContext>();
    
    // Tăng thời gian chờ và số lần thử lại cho môi trường Render
    const int maxRetries = 5;
    for (int attempt = 1; attempt <= maxRetries; attempt++)
    {
        try
        {
            logger.LogInformation("Đang kiểm tra và chạy database migration (lần {Attempt}/{MaxRetries})...", attempt, maxRetries);
            
            // Đảm bảo có thể kết nối trước khi chạy migration
            if (await db.Database.CanConnectAsync())
            {
                await db.Database.MigrateAsync();
                await DbInitializer.SeedAsync(db);
                logger.LogInformation("Migration và Seed dữ liệu thành công.");
                break;
            }
            else if (attempt == maxRetries)
            {
                logger.LogError("Không thể kết nối tới Database sau {MaxRetries} lần thử.", maxRetries);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Migration thất bại lần {Attempt}, thử lại sau 5 giây...", attempt);
            if (attempt == maxRetries)
            {
                logger.LogError(ex, "Migration thất bại hoàn toàn sau {MaxRetries} lần thử. App vẫn sẽ cố gắng khởi động.");
            }
            else
            {
                await Task.Delay(TimeSpan.FromSeconds(5));
            }
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
