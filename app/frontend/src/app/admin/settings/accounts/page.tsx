"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import Link from "next/link";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  const load = () => {
    setLoading(true);
    adminSettingService.getAccounts()
      .then(d => setAccounts(d.accountAdminList ?? d.accountList ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = accounts.filter(a =>
    !search || a.fullName?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1 className="box-title">Admin Accounts</h1>

      <div className="section-5">
        <div className="inner-wrap">
          <div className="inner-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder="Search accounts..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="inner-button-create">
            <Link href="/admin/settings/accounts/create">+ Create New</Link>
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
                  <th className="text-left">Full Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Role</th>
                  <th className="text-center">Status</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={6} className="text-center" style={{ padding: 30, color: "#bbb" }}>No accounts found</td></tr>
                  : filtered.map((acc: any) => (
                    <tr key={acc._id}>
                      <td className="text-center">
                        {acc.avatar
                          ? <img src={acc.avatar} alt={acc.fullName} className="inner-avatar" />
                          : <div style={{ width:44, height:44, borderRadius:"50%", background:"#4880FF", display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700 }}>{acc.fullName?.[0]?.toUpperCase()}</div>
                        }
                      </td>
                      <td className="text-left">{acc.fullName}</td>
                      <td className="text-left">{acc.email}</td>
                      <td className="text-left">{acc.roleName ?? acc.role?.name ?? "—"}</td>
                      <td className="text-center">
                        <span className={`tag ${acc.status === "active" ? "tag-green" : acc.status === "initial" ? "tag-orange" : "tag-red"}`}>
                          {acc.status === "initial" ? "Pending" : acc.status}
                        </span>
                      </td>
                      <td className="text-left">
                        <div className="box-actions">
                          <Link href={`/admin/settings/accounts/${acc._id}`} className="inner-edit">
                            <i className="fa-solid fa-pen-to-square" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
