"use client";
import { useEffect, useState, Suspense } from "react";
import { adminUserService } from "@/services/admin.service";
import { useRouter, useSearchParams } from "next/navigation";

function UserListContent() {
  const router = useRouter();
  const sp = useSearchParams();

  const page    = sp.get("page") || "1";
  const keyword = sp.get("keyword") || "";
  const status  = sp.get("status") || "";

  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState(keyword);

  const buildQuery = (overrides: Record<string, string> = {}) => {
    const p: Record<string, string> = { page, keyword, status, ...overrides };
    const qs = Object.entries(p).filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    return `/admin/users${qs ? "?" + qs : ""}`;
  };

  useEffect(() => {
    setLoading(true);
    adminUserService.getList({ page, keyword, status })
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [page, keyword, status]);

  const list        = data?.userList ?? [];
  const pag         = data?.pagination;
  const skip        = pag?.skip ?? 0;
  const totalRecord = pag?.totalRecord ?? list.length;
  const currentPage = pag?.currentPage ?? parseInt(page);
  const totalPage   = pag?.totalPage ?? 1;
  const showFrom    = totalRecord === 0 ? 0 : skip + 1;
  const showTo      = Math.min(skip + list.length, totalRecord);

  return (
    <>
      <h1 className="box-title">User Management</h1>

      {/* Section 4 */}
      <div className="section-4">
        <div className="inner-wrap">
          <div className="inner-item inner-label">
            <i className="fa-solid fa-filter" />
          </div>
          <div className="inner-item">
            <select value={status} onChange={e => router.push(buildQuery({ status: e.target.value, page: "1" }))}>
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="inner-item inner-reset">
            <a style={{ cursor: "pointer" }} onClick={() => router.push("/admin/users")}>
              <i className="fa-solid fa-rotate-left" />
            </a>
          </div>
        </div>
      </div>

      {/* Section 5 */}
      <div className="section-5">
        <div className="inner-wrap">
          <form className="inner-search"
            onSubmit={e => { e.preventDefault(); router.push(buildQuery({ keyword: search, page: "1" })); }}>
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder="Search users..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
      </div>

      {/* Section 6 */}
      <div className="section-6">
        {loading ? <p style={{ padding: 20 }}>Loading...</p> : (
          <div className="table-2">
            <table>
              <thead>
                <tr>
                  <th className="text-center">Avatar</th>
                  <th className="text-left">Full Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Phone</th>
                  <th className="text-center">Status</th>
                  <th className="text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0
                  ? <tr><td colSpan={6} className="text-center" style={{ padding: 30, color: "#bbb" }}>No users found</td></tr>
                  : list.map((u: any) => (
                    <tr key={u._id}>
                      <td className="text-center">
                        {u.avatar
                          ? <img src={u.avatar} alt={u.fullName} className="inner-avatar" />
                          : <span style={{ display: "inline-flex", width: 44, height: 44, borderRadius: "50%", background: "#4880FF", color: "#fff", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{u.fullName?.[0]?.toUpperCase()}</span>
                        }
                      </td>
                      <td className="text-left">{u.fullName}</td>
                      <td className="text-left">{u.email}</td>
                      <td className="text-left">{u.phone ?? "—"}</td>
                      <td className="text-center">
                        <span className={`tag ${u.status === "active" ? "tag-green" : "tag-red"}`}>
                          {u.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-left">
                        <div>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 7 */}
      {!loading && totalRecord > 0 && (
        <div className="section-7">
          <span className="inner-label">Showing {showFrom}–{showTo} of {totalRecord}</span>
          <select className="inner-pagination" value={currentPage}
            onChange={e => router.push(buildQuery({ page: e.target.value }))}>
            {Array.from({ length: totalPage }, (_, i) => i + 1).map(p =>
              <option key={p} value={p}>Page {p}</option>
            )}
          </select>
        </div>
      )}
    </>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <UserListContent />
    </Suspense>
  );
}
