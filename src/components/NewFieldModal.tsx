import React from "react";
import { X, Plus, Image as ImageIcon, MapPin, DollarSign, Info, Shield, Layers, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/format";
import { fieldService } from "../services/fieldService";
import type { Field } from "../types";
import { Button } from "./common/Button";

interface NewFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Gọi sau khi tạo/cập nhật sân thành công (reload danh sách). */
  onCreated?: () => void;
  /** Nếu truyền vào, modal sẽ ở chế độ chỉnh sửa. */
  fieldToEdit?: Field | null;
}

export const NewFieldModal: React.FC<NewFieldModalProps> = ({ isOpen, onClose, onCreated, fieldToEdit }) => {
  const [step, setStep] = React.useState(1);
  const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([]);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState(1);
  const [location, setLocation] = React.useState("");
  const [pricePerHour, setPricePerHour] = React.useState("");
  const [maxPlayers, setMaxPlayers] = React.useState(10);
  const [imageUrl, setImageUrl] = React.useState("");
  const [position, setPosition] = React.useState("Front");
  const [format, setFormat] = React.useState("FiveSide");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Điền dữ liệu khi mở ở chế độ Edit
  React.useEffect(() => {
    if (isOpen && fieldToEdit) {
      setName(fieldToEdit.name);
      setDescription(fieldToEdit.description || "");
      // Chú ý: Category ở đây là object {id, name}, cần tìm ID
      // Field.categoryId có thể không có trong frontend Type, check types.ts
      // Giả sử type.ts có categoryId hoặc ta tìm từ tên
      void (async () => {
        const cats = await fieldService.getCategories();
        const found = cats.find(c => c.name === fieldToEdit.type);
        if (found) setCategoryId(found.id);
      })();
      setLocation(fieldToEdit.location);
      setPricePerHour(String(fieldToEdit.price));
      setMaxPlayers(fieldToEdit.maxPlayers || 10);
      setImageUrl(fieldToEdit.image || "");
      setPosition(fieldToEdit.position || "Front");
      setFormat(fieldToEdit.format || "FiveSide");
    } else if (isOpen && !fieldToEdit) {
      // Reset form khi mở ở chế độ Thêm mới
      setName("");
      setDescription("");
      setLocation("");
      setPricePerHour("");
      setMaxPlayers(10);
      setImageUrl("");
      setPosition("Front");
      setFormat("FiveSide");
      setStep(1);
    }
  }, [isOpen, fieldToEdit]);

  React.useEffect(() => {
    if (!isOpen) return;
    void (async () => {
      try {
        const c = await fieldService.getCategories();
        setCategories(c.map((x) => ({ id: x.id, name: x.name })));
        if (c.length) setCategoryId(c[0].id);
      } catch {
        setCategories([{ id: 1, name: "Bóng đá" }]);
        setCategoryId(1);
      }
    })();
  }, [isOpen]);

  const close = () => {
    setStep(1);
    setError(null);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeploy = async () => {
    setError(null);
    const price = Number(pricePerHour);
    if (!name.trim() || !location.trim() || !Number.isFinite(price) || price <= 0) {
      setError("Điền đủ tên, địa chỉ và giá hợp lệ.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        categoryId,
        location: location.trim(),
        pricePerHour: price,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || null,
        maxPlayers,
        position,
        format,
      };

      if (fieldToEdit) {
        await fieldService.updateField(Number(fieldToEdit.id), payload);
      } else {
        await fieldService.createField(payload);
      }

      onCreated?.();
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Thao tác thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 1, name: "Basic Info", icon: Info },
    { id: 2, name: "Pricing & Location", icon: DollarSign },
    { id: 3, name: "Amenities", icon: Shield },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto"
          >
            <div className="w-full md:w-80 bg-[#121417] p-10 text-white flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-[#146312] rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-green-900/40">
                  {fieldToEdit ? <Zap className="w-8 h-8 text-white" /> : <Plus className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-3xl font-black font-headline tracking-tight leading-none mb-4">
                  {fieldToEdit ? "Update Pitch" : "Add New Pitch"}
                </h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed mb-12">Lưu vào SQL Server qua API (Admin JWT).</p>
                <div className="space-y-6">
                  {steps.map((s) => (
                    <div
                      key={s.id}
                      className={cn(
                        "flex items-center gap-4 transition-all duration-500",
                        step === s.id ? "opacity-100 translate-x-2" : "opacity-30"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          step === s.id ? "bg-[#146312] text-white" : "bg-white/10 text-white"
                        )}
                      >
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                  <Zap className="w-4 h-4 text-[#146312]" />
                  <span>SQL Server + EF Core</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-12 bg-white overflow-y-auto">
              <button type="button" onClick={close} className="absolute top-8 right-8 p-3 hover:bg-surface-container-low rounded-full transition-colors z-10">
                <X className="w-6 h-6" />
              </button>

              {error && <p className="text-sm font-bold text-red-600 mb-4">{error}</p>}

              <div className="max-w-xl mx-auto space-y-10">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Pitch Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="The Emerald Arena"
                        className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Category (SQL)</label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold appearance-none"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Max players</label>
                      <input
                        type="number"
                        min={2}
                        max={40}
                        value={maxPlayers}
                        onChange={(e) => setMaxPlayers(Number(e.target.value) || 10)}
                        className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Field Position</label>
                      <div className="grid grid-cols-2 gap-4">
                        {["Front", "Back"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPosition(p)}
                            className={cn(
                              "py-4 rounded-2xl font-bold text-sm transition-all",
                              position === p 
                                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                            )}
                          >
                            {p === "Front" ? "Sân tiền" : "Sân sâu"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Loại sân</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[{v:"FiveSide",l:"Sân 5"},{v:"SevenSide",l:"Sân 7"},{v:"ElevenSide",l:"Sân 11"}].map((f) => (
                          <button
                            key={f.v}
                            type="button"
                            onClick={() => setFormat(f.v)}
                            className={cn(
                              "py-4 rounded-2xl font-bold text-sm transition-all",
                              format === f.v
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                            )}
                          >
                            {f.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Description</label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the pitch..."
                        className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Pitch Image</label>
                      <label className="block w-full h-48 border-2 border-dashed border-surface-container-highest rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-surface-container-low transition-colors relative overflow-hidden group">
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        {imageUrl ? (
                          <>
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <p className="text-white font-bold text-sm">Click to change</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                            <p className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">Click to upload image</p>
                          </>
                        )}
                      </label>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Price per Hour (VNĐ)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                        <input
                          type="number"
                          value={pricePerHour}
                          onChange={(e) => setPricePerHour(e.target.value)}
                          placeholder="500000"
                          className="w-full bg-surface-container-low border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Full Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Hà Nội"
                          className="w-full bg-surface-container-low border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest text-primary">Xác nhận</p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Bấm Deploy để POST /api/fields (cần đăng nhập Admin).
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4 pt-8">
                  {step > 1 && (
                    <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs">
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    disabled={submitting}
                    onClick={() => (step < 3 ? setStep(step + 1) : void handleDeploy())}
                    className="flex-[2] py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                  >
                    {step === 3 ? (submitting ? "Saving…" : (fieldToEdit ? "Save Changes" : "Deploy Pitch")) : "Next Step"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
