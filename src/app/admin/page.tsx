// src/app/admin/page.tsx  (server guard + entry)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminApp from "./AdminApp";

export default async function AdminPage() {
  const c = await cookies();
  const role = c.get("role")?.value;
  if (role !== "admin") redirect("/"); // hard gate
  return <AdminApp />;
}
