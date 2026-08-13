"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import Link from "next/link";

export default function RolesPage() {
  const [roles, setRoles]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminSettingService.getRoles()
      .then(d => setRoles(d.roleList ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <h1 className="box-title">Roles &amp; Permissions</h1>

      {/* Section 5 */}
      <div className="section-5">
        <div className="inner-wrap">
          <div className="inner-button-create">
            <Link href="/admin/settings/roles/create">+ Create New</Link>
          </div>
        </div>
      </div>

      {/* Section 6 */}
      <div className="section-6">
        {loading ? <p style={{ padding: 20 }}>Loading...</p> : (
          <div className="table-2">
            <table>
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Role Name</th>
                  <th className="text-left">Permissions</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0
                  ? <tr><td colSpan={4} className="text-center" style={{ padding: 30, color: "#bbb" }}>No roles found</td></tr>
                  : roles.map((role: any, i: number) => (
                    <tr key={role._id}>
                      <td className="text-left">{i + 1}</td>
                      <td className="text-left">{role.name}</td>
                      <td className="text-left">{(role.permissions ?? []).length} permissions</td>
                      <td className="text-left">
                        <div className="box-actions">
                          <Link href={`/admin/settings/roles/${role._id}`} className="inner-edit">
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
