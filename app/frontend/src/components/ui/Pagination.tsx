"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPage: number;
}

export default function Pagination({ currentPage, totalPage }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPage <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="box-pagination">
      <div className="inner-list-button">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          <i className="fa-solid fa-angles-left"></i>
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={page === currentPage ? "active" : ""}
          >
            {page}
          </button>
        ))}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPage}>
          <i className="fa-solid fa-angles-right"></i>
        </button>
      </div>
    </div>
  );
}
