import React from "react";
import { BookingsView } from "../components/profile/BookingsView";

/** Trang /reviews — dùng chung logic với My Bookings (SQL Server). */
const ReviewsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-8 py-12">
    <BookingsView />
  </div>
);

export default ReviewsPage;
