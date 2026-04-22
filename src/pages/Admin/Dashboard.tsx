import React from 'react';
import { Calendar, Map as Stadium, UserCheck, DollarSign, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { cn, formatVnd } from '../../utils/format';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';
import { dashboardService, type DashboardStatsDto } from '../../services/dashboardService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);
  const [stats, setStats] = React.useState<DashboardStatsDto | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const avatar = user?.avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

  React.useEffect(() => {
    void (async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lỗi khi tải thống kê.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />

      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Dashboard Overview</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Thống kê dữ liệu thực tế từ hệ thống.</p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-2">
              <Calendar className="text-primary w-4 h-4" />
              <span className="text-sm font-semibold">{new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            <img src={avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-white stadium-shadow" />
          </div>
        </header>

        {loading && <p className="font-bold mb-8">Đang tải biểu đồ...</p>}
        {error && <p className="text-red-600 font-bold mb-8">{error}</p>}

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {[
                { label: 'Tổng doanh thu', val: `${formatVnd(Number(stats.totalRevenue))} ₫`, icon: DollarSign, trend: 'N/A', color: 'text-primary' },
                { label: 'Đơn đặt sân', val: stats.totalBookings, icon: BarChart3, trend: 'N/A', color: 'text-on-surface' },
                { label: 'Người dùng', val: stats.totalUsers, icon: UserCheck, trend: 'N/A', color: 'text-secondary' },
                { label: 'Sân bóng', val: stats.activeFields, icon: Stadium, trend: 'N/A', color: 'text-blue-600' }
              ].map((stat) => (
                <div key={stat.label} className="bg-white stadium-shadow rounded-xl p-6 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-lg bg-current/10", stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-black font-headline mt-1">{stat.val}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              <div className="lg:col-span-8 bg-white stadium-shadow rounded-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-lg font-bold">Tăng trưởng doanh thu (30 ngày)</h4>
                </div>
                
                {stats.revenueItems.length > 0 ? (
                  <>
                    <div className="h-64 flex items-end justify-between gap-1">
                      {stats.revenueItems.map((item, i) => {
                        const maxRev = Math.max(...stats.revenueItems.map(r => r.revenue)) || 1;
                        const h = Math.max((item.revenue / maxRev) * 100, 2);
                        return (
                          <div key={i} className="flex-1 bg-surface-container-low rounded-t-lg transition-all hover:bg-primary/20 relative group" style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity">
                              {formatVnd(Number(item.revenue))} ₫
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-surface-container-low rounded-xl">
                    <p className="text-on-surface-variant font-bold">Chưa có dữ liệu doanh thu</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
