"use client";
import { useEffect, useState, Suspense } from "react";
import { adminCategoryService } from "@/services/admin.service";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function CategoryListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(keyword);

  const load = () => {
    setLoading(true);
    adminCategoryService.getList({ page, keyword, status })
      .then(setData)
      .catch(err => { if (err?.response?.status === 401) router.push("/admin/auth/login"); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, keyword, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("keyword", search);
    if (status) params.set("status", status);
    router.push(`/admin/categories?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await adminCategoryService.softDelete(id);
    load();
  };

  const pushParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/admin/categories?${params.toString()}`);
  };

  const pagination = data?.pagination;
  const list = data?.categoryList || [];
  const currentPage = parseInt(page);
  const totalPage = pagination?.totalPage || 1;
  const totalItems = pagination?.totalRecord ?? pagination?.totalItems ?? list.length;
  const limit = pagination?.limitItems ?? pagination?.limit ?? 10;
  const skip = pagination?.skip ?? (currentPage - 1) * limit;
  const startItem = totalItems === 0 ? 0 : skip + 1;
  const endItem = Math.min(skip + list.length, totalItems);
  const pageOptions = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div>
      <h1 className="box-title">Categories</h1>

      <div className="section-4">
        <div className="inner-wrap">
          <div className="inner-item">
            <select
              value={status}
              onChange={e => pushParam("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-5">
        <div className="inner-wrap">
          <form className="inner-search" onSubmit={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
          <Link href="/admin/categories/create" className="inner-button-create">
            <i className="fa-solid fa-plus"></i> Add Category
          </Link>
        </div>
      </div>

      <div className="section-6">
        <div className="table-2">
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="text-center inner-small">#</th>
                  <th className="text-center">Avatar</th>
                  <th className="text-left">Category Name</th>
                  <th className="text-left">Parent</th>
                  <th className="text-center inner-small">Position</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">No categories found</td>
                  </tr>
                )}
                {list.map((cat: any, i: number) => (
                  <tr key={cat._id}>
                    <td className="text-center">{(currentPage - 1) * limit + i + 1}</td>
                    <td className="text-center">
                      {cat.avatar
                        ? <img src={cat.avatar} alt={cat.name} className="inner-avatar" />
                        : <span>—</span>
                      }
                    </td>
                    <td className="text-left">{cat.name}</td>
                    <td className="text-left">{cat.parent?.name || "—"}</td>
                    <td className="text-center">{cat.position ?? 0}</td>
                    <td className="text-center">
                      {cat.status === "active"
                        ? <span className="tag tag-green">Active</span>
                        : <span className="tag tag-red">Inactive</span>
                      }
                    </td>
                    <td className="text-center">
                      <div className="box-actions">
                        <Link href={`/admin/categories/${cat._id}`} className="inner-edit">
                          <i className="fa-solid fa-pen"></i>
                        </Link>
                        <a
                          className="inner-remove"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(cat._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {!loading && totalItems > 0 && (
        <div className="section-7">
          <span className="inner-label">
            Showing {startItem}–{endItem} of {totalItems}
          </span>
          <select
            className="inner-pagination"
            value={currentPage}
            onChange={e => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", e.target.value);
              router.push(`/admin/categories?${params.toString()}`);
            }}
          >
            {pageOptions.map(p => (
              <option key={p} value={p}>Page {p}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px" }}>Loading...</div>}>
      <CategoryListContent />
    </Suspense>
  );
}
