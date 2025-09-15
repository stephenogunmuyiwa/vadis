// src/app/admin/AdminApp.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/production/useSession";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OverviewPanel from "@/components/admin/OverviewPanel";
import UsersPanel from "@/components/admin/UsersPanel";
import ProjectsPanel from "@/components/admin/ProjectsPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";
import TopBar from "@/components/header/TopBar";
type Tab = "Overview" | "Users" | "Projects" | "System settings";

export default function AdminApp() {
  const router = useRouter();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && (!session?.ok || session.role !== "admin"))
      router.replace("/");
  }, [isLoading, session, router]);

  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="min-h-screen bg-app text-gray-900">
      <TopBar
        brand={{
          logoSrc: "/file.svg",
          label: "VadisAI",
          href: "/",
        }}
        crumbs={[{ label: "Admin", href: `/${tab}` }, { label: `${""}` }]}
      />
      <div className="flex">
        <AdminSidebar tab={tab} onSelect={(t) => setTab(t as Tab)} />
        <main className="flex-1 p-6 space-y-6">
          {tab === "Overview" && <OverviewPanel />}
          {tab === "Users" && <UsersPanel />}
          {tab === "Projects" && <ProjectsPanel />}
          {tab === "System settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}
