import { notFound, redirect } from "next/navigation";
import { isRole } from "@/types/roles";
import RoleShell from "@/components/role/RoleShell";

export default async function RoleHome({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  } else {
    redirect(`/${role}`);
  }

  //   return <RoleShell role={role as any} />;
}
