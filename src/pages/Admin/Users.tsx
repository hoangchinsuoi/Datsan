import React from 'react';
import { Search, Filter, MoreHorizontal, Mail, Shield, UserX, UserCheck, Users as UsersIcon } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/format';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';
import { userService, type AdminUser } from '../../services/userService';

const AdminUsers: React.FC = () => {
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi khi tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleToggleStatus = async (id: number) => {
    try {
      await userService.toggleStatus(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Cập nhật thất bại.");
    }
  };

  const handleChangeRole = async (id: number, currentRole: string) => {
    const roles = ["Member", "Owner", "Admin"];
    const newRole = roles[(roles.indexOf(currentRole) + 1) % roles.length];
    if (!window.confirm(`Bạn có chắc muốn đổi vai trò của người dùng này sang ${newRole}?`)) return;
    try {
      await userService.changeRole(id, newRole);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Đổi vai trò thất bại.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />

      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">User Management</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Quản lý tài khoản người chơi, phân quyền và truy cập.</p>
          </div>
          <Button className="flex items-center gap-2" variant="outline" onClick={() => window.alert("Chức năng đang phát triển")}>
            <UsersIcon className="w-5 h-5" /> Invite Admin
          </Button>
        </header>

        <section className="bg-white stadium-shadow rounded-xl overflow-hidden">
          {loading && <div className="p-8 text-center font-bold">Đang tải...</div>}
          {error && <div className="p-8 text-center text-red-500 font-bold">{error}</div>}

          <div className="p-8 flex justify-between items-center border-b border-surface-container">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs font-medium w-64" placeholder="Search by name, email or ID..." />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Joined Date</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-bold text-sm uppercase">
                          {u.fullName[0]}
                        </div>
                        <div>
                          <span className="text-sm font-bold block">{u.fullName}</span>
                          <span className="text-xs text-on-surface-variant">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => handleChangeRole(u.id, u.role)}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      >
                        {u.role === 'Admin' ? <Shield className="w-3.5 h-3.5 text-secondary" /> : 
                         u.role === 'Owner' ? <Shield className="w-3.5 h-3.5 text-blue-500" /> :
                         <UsersIcon className="w-3.5 h-3.5 text-on-surface-variant" />}
                        <span className="text-sm font-medium">{u.role}</span>
                      </button>
                    </td>
                    <td className="px-8 py-5 text-sm">{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest",
                        u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {u.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"><Mail className="w-4 h-4" /></button>
                        <button 
                          onClick={() => handleToggleStatus(u.id)}
                          className={cn("p-2 rounded-lg", u.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50")}
                          title={u.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        >
                          {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !loading && (
                   <tr><td colSpan={5} className="px-8 py-20 text-center text-on-surface-variant font-medium">Không tìm thấy người dùng nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminUsers;
