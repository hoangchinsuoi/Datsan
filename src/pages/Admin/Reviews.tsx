import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/format';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';
import { reviewService, type ReviewDto } from '../../services/reviewService';

const AdminReviews: React.FC = () => {
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);
  const [reviews, setReviews] = React.useState<ReviewDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllAdmin();
      setReviews(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi khi tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      await reviewService.deleteAdmin(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Xóa thất bại.");
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />

      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="mb-12">
          <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Review Management</h2>
          <p className="text-on-surface-variant mt-2 font-medium">Theo dõi phản hồi và quản lý đánh giá của người dùng.</p>
        </header>

        {loading && <div className="p-8 text-center font-bold">Đang tải...</div>}
        {error && <div className="p-8 text-center text-red-500 font-bold">{error}</div>}

        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white stadium-shadow rounded-2xl p-8 flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-black text-xl uppercase">
                  {(review.userFullName || "U")[0]}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-secondary fill-current" : "text-surface-container-highest")} />
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black font-headline text-lg">{review.userFullName}</h4>
                    <p className="text-sm text-on-surface-variant">
                      Đã đánh giá sân <span className="font-bold text-primary">{review.fieldName}</span> • {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <p className="text-on-surface italic leading-relaxed">"{review.comment}"</p>
                
                <div className="mt-6 flex justify-end gap-3 border-t border-surface-container pt-6">
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Xóa đánh giá
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && !loading && (
             <div className="p-8 text-center text-on-surface-variant font-medium bg-white stadium-shadow rounded-2xl">
               Chưa có đánh giá nào.
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReviews;
