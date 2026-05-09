# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy file csproj và restore dependencies trước để tận dụng cache của Docker
COPY server/Datsan.Server.csproj ./server/
RUN dotnet restore server/Datsan.Server.csproj

# Copy toàn bộ mã nguồn
COPY . .

# Build project server
WORKDIR /src/server
RUN dotnet publish Datsan.Server.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Cấu hình Port cho Render (Render thường dùng port 8080 hoặc 10000)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Datsan.Server.dll"]
