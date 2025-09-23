// components/investor/ProjectCard.tsx
import Link from "next/link";
import Badge from "./Badge";
import Metric from "./Metric";
import { FileText, Users, Star } from "lucide-react";
import { Project } from "@/types/investor/project";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/investor/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition"
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition will-change-transform group-hover:scale-[1.02]"
        />
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3">
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-neutral-900">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-xs text-neutral-600">
            {project.tagline}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Metric icon={<FileText className="h-3.5 w-3.5" />}>
            {project.stats.docs}
          </Metric>
          <Metric icon={<Users className="h-3.5 w-3.5" />}>
            {project.stats.collaborators}
          </Metric>
          <Metric icon={<Star className="h-3.5 w-3.5" />}>
            {project.stats.rating.toFixed(1)}/5
          </Metric>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Badge tone="purple">{project.tags.genre}</Badge>
          <Badge tone="gray">{project.tags.content}</Badge>
          <Badge tone="blue">{project.tags.audience}</Badge>
        </div>
      </div>
    </Link>
  );
}
