import { Suspense } from "react";
import SearchContent from "./_SearchContent";
import T from "@/components/shared/T";

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px 0" }}><T ns="common" k="loading" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
