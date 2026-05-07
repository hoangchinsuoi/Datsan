import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/common/Button";

const PaymentResult: React.FC = () => {
  const [params] = useSearchParams();
  const success = params.get("success") === "true";
  const bookingId = params.get("bookingId");
  const txn = params.get("txn");
  const code = params.get("code");

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="bg-white rounded-3xl stadium-shadow p-8 space-y-5">
        <h1 className="text-3xl font-black font-headline">
          {success ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </h1>
        <p className="text-on-surface-variant">
          {success
            ? "Booking của bạn đã được thanh toán và đang chờ Admin xác nhận. Cảm ơn bạn đã thanh toán qua VNPay."
            : "Giao dịch chưa hoàn tất. Bạn có thể thử thanh toán lại trong trang My Bookings."}
        </p>
        <div className="text-sm space-y-1 text-on-surface-variant">
          <p>Booking: {bookingId || "-"}</p>
          <p>Mã giao dịch: {txn || "-"}</p>
          <p>Mã phản hồi: {code || "-"}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <Link to="/bookings">
            <Button>Về My Bookings</Button>
          </Link>
          <Link to="/">
            <Button variant="ghost">Về trang chủ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
