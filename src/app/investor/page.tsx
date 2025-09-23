// app/investor/page.tsx
import TopStats from "@/components/investor/TopStats";
import Tabs from "@/components/investor/Tabs";
import FiltersBar from "@/components/investor/FiltersBar";
import ProjectCard from "@/components/investor/ProjectCard";
import { projects } from "@/data/investor/projects";

export default function ExploreProjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Investor hub</h1>
      <TopStats />
      <Tabs />
      <section className="pt-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-700">
            Discover Perfect Projects to invest.
          </p>
        </div>

        <FiltersBar />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
