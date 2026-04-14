/** Chuyển chuỗi kiểu "09:30 AM" thành start/end (HH:mm:ss) cho API TimeOnly. */
export function slotLabelToStartEnd(slot: string): { start: string; end: string } {
  const trimmed = slot.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new Error('Khung giờ không hợp lệ.');

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ap = match[3].toUpperCase();

  if (ap === 'PM' && hour !== 12) hour += 12;
  if (ap === 'AM' && hour === 12) hour = 0;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const start = `${pad(hour)}:${pad(minute)}:00`;

  const base = new Date(2000, 0, 1, hour, minute, 0, 0);
  base.setMinutes(base.getMinutes() + 90);
  const end = `${pad(base.getHours())}:${pad(base.getMinutes())}:00`;

  return { start, end };
}

/** Ngày đặt: ô lịch 1–14, ô 5 = hôm nay. Trả về mảng các đối tượng chứa thông tin ngày. */
export interface CalendarDate {
  cellId: number;
  label: string;
  isoDate: string;
  isToday: boolean;
  dayName: string;
  monthName: string;
  year: number;
}

export function getCalendarDates(): CalendarDate[] {
  const anchor = 5;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 14 }).map((_, i) => {
    const cellId = i + 1;
    const d = new Date(today);
    d.setDate(today.getDate() + (cellId - anchor));
    
    return {
      cellId,
      label: String(d.getDate()),
      isoDate: d.toISOString().slice(0, 10),
      isToday: cellId === anchor,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      monthName: d.toLocaleDateString('en-US', { month: 'long' }),
      year: d.getFullYear(),
    };
  });
}

export function calendarCellToIsoDate(selectedCell: number): string {
  const dates = getCalendarDates();
  return dates.find(d => d.cellId === selectedCell)?.isoDate || new Date().toISOString().slice(0, 10);
}
