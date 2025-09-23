// app/investor/[slug]/page.tsx
"use client";

import { notFound, useParams } from "next/navigation";
import { projects } from "@/data/investor/projects";
import Badge from "@/components/investor/Badge";
import Metric from "@/components/investor/Metric";
import { FileText, Users, Star, Play, LineChart } from "lucide-react";
import RoiForecastSheet from "@/components/investor/RoiForecastSheet";
import { useDisclosure } from "@/hooks/investor/useDisclosure";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const roi = useDisclosure(false);

  if (!project) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className="h-48 w-56 overflow-hidden rounded-xl">
            <img
              src={project.image}
              className="h-full w-full object-cover"
              alt={project.title}
            />
          </div>

          <div className="pt-1">
            <h1 className="text-xl font-semibold text-neutral-900">
              {project.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600">
              {project.tagline}
            </p>

            <div className="mt-4 flex items-center gap-4">
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

            <div className="mt-3 flex items-center gap-2">
              <Badge tone="purple">{project.tags.genre}</Badge>
              <Badge tone="gray">{project.tags.content}</Badge>
              <Badge tone="blue">{project.tags.audience}</Badge>
            </div>
          </div>
        </div>

        <button
          onClick={roi.open}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Expected ROI
          <LineChart className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex items-center gap-6">
          <button className="relative py-3 text-sm font-medium text-neutral-900">
            Overview
            <span className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-violet-500" />
          </button>
          <a
            href="#posters"
            className="py-3 text-sm font-medium text-neutral-500 hover:text-neutral-800"
          >
            Posters
          </a>
        </div>
      </div>

      {/* Overview body */}
      <div className="space-y-6">
        {project.description.map((p, i) => (
          <p key={i} className="text-sm leading-6 text-neutral-700">
            {p}
          </p>
        ))}
      </div>

      {/* Posters */}
      <div id="posters" className="pt-2">
        <div className="border-b border-neutral-200">
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="py-3 text-sm font-medium text-neutral-500 hover:text-neutral-800"
            >
              Overview
            </a>
            <button className="relative py-3 text-sm font-medium text-neutral-900">
              Posters
              <span className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-violet-500" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3">
          {(project.posters ?? []).slice(0, 6).map((src, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer bar with production cost + ROI CTA */}
      <div className="sticky bottom-4 z-10 mx-[-.5rem] rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm sm:mx-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-700">
            Production cost:{" "}
            <span className="font-semibold">
              ${project.productionCost.toLocaleString()}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50">
              ROI Forecast
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
              <Play className="h-4 w-4" />
              Invest in project
            </button>
          </div>
        </div>
      </div>

      {/* ROI SHEET */}
      <RoiForecastSheet
        open={roi.isOpen}
        onClose={roi.close}
        title="Expected ROI"
      >
        <dl className="grid grid-cols-1 gap-4 text-sm">
          <div className="border-b border-neutral-200 pb-4">
            <dt className="text-neutral-500">Production cost</dt>
            <dd className="mt-1 font-medium text-neutral-900">
              ${project.productionCost.toLocaleString()}
            </dd>
          </div>

          <div className="border-b border-neutral-200 pb-4">
            <dt className="text-neutral-500">Projected ROI</dt>
            <dd className="mt-1 font-medium text-neutral-900">120% – 180%</dd>
          </div>

          <div className="border-b border-neutral-200 pb-4">
            <dt className="text-neutral-500">Investment risk level</dt>
            <dd className="mt-1 font-medium text-emerald-600">Low</dd>
          </div>

          <div>
            <dt className="mb-2 text-neutral-500">
              Similar Projects Benchmarks:
            </dt>
            <dd className="text-neutral-800">
              Projects in the same genre with comparable budgets returned an
              average of 135% ROI in the last 5 years
            </dd>
          </div>

          <div>
            <dt className="mb-2 text-neutral-500">Revenue channels</dt>
            <dd>
              <ul className="list-disc space-y-2 pl-5 text-neutral-800">
                <li>Box Office (Domestic + International)</li>
                <li>
                  Streaming Rights (Netflix, Prime, Disney+, regional platforms)
                </li>
                <li>TV/Distribution Deals</li>
                <li>Merchandising &amp; Licensing</li>
                <li>Brand/Product Placement Revenue</li>
                <li>Festival Awards &amp; Grants (if applicable)</li>
              </ul>
            </dd>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50">
              Save project
            </button>
            <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
              Invest in Project
            </button>
          </div>
        </dl>
      </RoiForecastSheet>
    </div>
  );
}
