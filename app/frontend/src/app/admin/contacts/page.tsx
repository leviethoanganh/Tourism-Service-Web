"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import T from "@/components/shared/T";

function ContactListContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const sp = useSearchParams();
  const keyword = sp.get("keyword") || "";
  const [search, setSearch] = useState(keyword);

  return (
    <>
      <h1 className="box-title">{t.adminContacts.title}</h1>

      {/* Section 5 */}
      <div className="section-5">
        <div className="inner-wrap">
          <form className="inner-search"
            onSubmit={e => { e.preventDefault(); router.push(search ? `/admin/contacts?keyword=${encodeURIComponent(search)}` : "/admin/contacts"); }}>
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder={t.adminContacts.searchPlaceholder} value={search}
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
                <th className="text-left">{t.adminCategories.colNo}</th>
                <th className="text-left">{t.adminUsers.colFullName}</th>
                <th className="text-left">{t.adminUsers.colEmail}</th>
                <th className="text-left">{t.adminUsers.colPhone}</th>
                <th className="text-left">{t.adminContacts.colMessage}</th>
                <th className="text-left">{t.adminContacts.colDate}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center" style={{ padding: "48px 0", color: "#bbb", fontSize: 15 }}>
                  {t.adminContacts.noMessagesYet}
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
    <Suspense fallback={<div style={{ padding: 20 }}><T ns="common" k="loading" /></div>}>
      <ContactListContent />
    </Suspense>
  );
}
