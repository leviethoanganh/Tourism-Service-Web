"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function TourFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
      <select
        className="border rounded px-3 py-2 text-sm"
        value={searchParams.get("priceRange") || ""}
        onChange={(e) => handleFilter("priceRange", e.target.value)}
      >
        <option value="">Tất cả mức giá</option>
        <option value="under-1m">Dưới 1 triệu</option>
        <option value="1m-2m">1 - 2 triệu</option>
        <option value="2m-6m">2 - 6 triệu</option>
        <option value="over-6m">Trên 6 triệu</option>
      </select>

      <input
        type="text"
        placeholder="Tìm kiếm tour..."
        className="border rounded px-3 py-2 text-sm flex-1 min-w-48"
        defaultValue={searchParams.get("keyword") || ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleFilter("keyword", e.currentTarget.value);
        }}
      />
    </div>
  );
}
