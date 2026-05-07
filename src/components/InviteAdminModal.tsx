import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { Button } from './common/Button';
import { userService } from '../services/userService';

type InviteAdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const InviteAdminModal: React.FC<InviteAdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await userService.inviteAdmin(formData);
      onSuccess();
      onClose();
      setFormData({ fullName: '', username: '', email: '', password: '', phone: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tạo tài khoản quản trị viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden stadium-shadow animate-in slide-in-from-bottom-4">
        <div className="p-6 border-b border-surface-container flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black font-headline text-on-surface">Mời Quản Trị Viên</h2>
            <p className="text-sm text-on-surface-variant mt-1">Tạo tài khoản Admin mới cho hệ thống</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Họ và tên</label>
            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary" placeholder="Nhập họ và tên..." />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Tên đăng nhập</label>
            <input required type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary" placeholder="Nhập tên đăng nhập..." />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary" placeholder="Nhập email..." />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Mật khẩu</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary" placeholder="Nhập mật khẩu..." />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Số điện thoại</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary" placeholder="Nhập số điện thoại (tùy chọn)..." />
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Hủy</Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
