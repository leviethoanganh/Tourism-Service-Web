import { Suspense } from "react";
import SearchContent from "./_SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px 0" }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
