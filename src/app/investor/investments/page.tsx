// app/investor/investments/page.tsx
import TopStats from "@/components/investor/TopStats";
import Tabs from "@/components/investor/Tabs";
import FiltersBar from "@/components/investor/FiltersBar";
import ProjectCard from "@/components/investor/ProjectCard";
import { projects } from "@/data/investor/projects";

export default function InvestmentsPage() {
  const invested = projects.slice(0, 3); // mock
  return (
    <div className="space-y-6">
      <TopStats />
      <Tabs />
      <section className="pt-2">
        <h2 className="mb-1 text-sm font-medium text-neutral-900">
          My Invested Projects
        </h2>
        <FiltersBar />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {invested.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
