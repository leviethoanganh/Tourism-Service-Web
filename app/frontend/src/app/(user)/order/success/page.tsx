import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
