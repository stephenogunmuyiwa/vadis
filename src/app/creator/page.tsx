import Sidebar from "./_components/Sidebar";
import CreatorTabs from "./_components/CreatorTabs";

export const metadata = {
  title: "Creator hub",
};

export default function CreatorPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Sidebar />
      <main className="pt-6">
        <CreatorTabs />
      </main>
    </div>
  );
}
