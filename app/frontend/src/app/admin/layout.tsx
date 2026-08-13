import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
      />
      <link rel="stylesheet" href="/admin/assets/css/style.css" />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
