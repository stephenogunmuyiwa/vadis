import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginPage from "@/components/login/LoginPage";
import { getRoleHome, isRole } from "@/types/roles";

export default async function Home() {
  const store = await cookies(); // Next 15: await
  const role = store.get("role")?.value;
  const token = store.get("auth_token")?.value;

  if (token && role && isRole(role)) {
    redirect(getRoleHome(role));
  }

  return <LoginPage />;
}
