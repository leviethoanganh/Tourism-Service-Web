"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ContactListContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const keyword = sp.get("keyword") || "";
  const [search, setSearch] = useState(keyword);

  return (
    <>
      <h1 className="box-title">Contact Info</h1>

      {/* Section 5 */}
      <div className="section-5">
        <div className="inner-wrap">
          <form className="inner-search"
            onSubmit={e => { e.preventDefault(); router.push(search ? `/admin/contacts?keyword=${encodeURIComponent(search)}` : "/admin/contacts"); }}>
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder="Search contacts..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
      </div>

      {/* Section 6 */}
      <div className="section-6">
        <div className="table-2">
          <table>
            <thead>
              <tr>
                <th className="text-left">#</th>
                <th className="text-left">Full Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Message</th>
                <th className="text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center" style={{ padding: "48px 0", color: "#bbb", fontSize: 15 }}>
                  No contact messages yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <ContactListContent />
    </Suspense>
  );
}
