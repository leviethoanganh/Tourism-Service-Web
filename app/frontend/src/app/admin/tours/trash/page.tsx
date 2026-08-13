"use client";
import { useEffect, useState, Suspense } from "react";
import { adminTourService } from "@/services/admin.service";
import { useRouter, useSearchParams } from "next/navigation";

function TourTrashContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const page = sp.get("page") || "1";

  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminTourService.getTrash({ page })
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleRestore = async (id: string) => {
    if (!confirm("Restore this tour?")) return;
    await adminTourService.restore(id).catch(() => {});
    load();
  };

  const handleDestroy = async (id: string) => {
    if (!confirm("Permanently delete this tour? This cannot be undone.")) return;
    await adminTourService.destroy(id).catch(() => {});
    load();
  };

  const list        = data?.tourList ?? [];
  const pag         = data?.pagination;
  const skip        = pag?.skip ?? 0;
  const totalRecord = pag?.totalRecord ?? list.length;
  const currentPage = pag?.currentPage ?? parseInt(page);
  const totalPage   = pag?.totalPage ?? 1;

  return (
    <>
      <h1 className="box-title">Tour Trash</h1>

      <div className="section-5">
        <div className="inner-wrap">
          <div className="inner-button-create">
            <a href="/admin/tours">← Back to Tours</a>
          </div>
        </div>
      </div>

      <div className="section-6">
        {loading ? <p style={{ padding: 20 }}>Loading...</p> : (
          <div className="table-2">
            <table>
              <thead>
                <tr>
                  <th className="text-center">Avatar</th>
                  <th className="text-left">Tour Name</th>
                  <th className="text-left">Price (Adult)</th>
                  <th className="text-center">Status</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0
                  ? <tr><td colSpan={5} className="text-center" style={{ padding: 30, color: "#bbb" }}>Trash is empty</td></tr>
                  : list.map((tour: any) => (
                    <tr key={tour._id}>
                      <td className="text-center">
                        {tour.avatar && <img src={tour.avatar} alt={tour.name} className="inner-avatar" />}
                      </td>
                      <td className="text-left">{tour.name}</td>
                      <td className="text-left">{(tour.priceNewAdult ?? 0).toLocaleString("en-US")} VND</td>
                      <td className="text-center">
                        <span className={`tag ${tour.status === "active" ? "tag-green" : "tag-red"}`}>
                          {tour.status}
                        </span>
                      </td>
                      <td className="text-left">
                        <div className="box-actions">
                          <a className="inner-edit" style={{ cursor:"pointer" }} onClick={() => handleRestore(tour._id)}>
                            <i className="fa-solid fa-rotate-left" />
                          </a>
                          <a className="inner-remove" style={{ cursor:"pointer" }} onClick={() => handleDestroy(tour._id)}>
                            <i className="fa-solid fa-trash-can" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && totalRecord > 0 && (
        <div className="section-7">
          <span className="inner-label">Showing {skip + 1}–{Math.min(skip + list.length, totalRecord)} of {totalRecord}</span>
          <select className="inner-pagination" value={currentPage}
            onChange={e => router.push(`/admin/tours/trash?page=${e.target.value}`)}>
            {Array.from({ length: totalPage }, (_, i) => i + 1).map(p =>
              <option key={p} value={p}>Page {p}</option>
            )}
          </select>
        </div>
      )}
    </>
  );
}

export default function TourTrashPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <TourTrashContent />
    </Suspense>
  );
}
