import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";
import T from "@/components/shared/T";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><T ns="common" k="loading" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
