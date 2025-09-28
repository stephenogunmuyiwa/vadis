"use client";
import React from "react";
import { Star, Users, Eye } from "lucide-react";

export type TagType =
  | "purple"
  | "gray"
  | "orange"
  | "green"
  | "indigo"
  | "blue";

export type ProjectCardTag = { text: string; variant?: TagType };

export type ProjectMeta = {
  views: number | string;
  episodes: number | string;
  rating: number | string;
};

export type ProjectCardItem = {
  id: string;
  title: string;
  img: string;
  desc: string;
  meta: ProjectMeta;
  tags: ProjectCardTag[];
};

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const Tag: React.FC<ProjectCardTag> = ({ text, variant = "gray" }) => {
  const theme: Record<TagType, string> = {
    purple: "bg-fuchsia-100 text-fuchsia-700",
    gray: "bg-neutral-100 text-neutral-700",
    orange: "bg-orange-100 text-orange-700",
    green: "bg-emerald-100 text-emerald-700",
    indigo: "bg-indigo-100 text-indigo-700",
    blue: "bg-sky-100 text-sky-700",
  };
  return (
    <span
      className={cls(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        theme[variant]
      )}
    >
      {text}
    </span>
  );
};

export interface ProjectCardProps {
  item: ProjectCardItem;
  onClick?: (id: string) => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  item,
  onClick,
  className,
}) => {
  return (
    <div
      className={cls(
        "overflow-hidden rounded-2xl border border-neutral-200 bg-white",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onClick?.(item.id)}
        className="h-44 w-full overflow-hidden focus:outline-none"
      >
        <img
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </button>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold text-neutral-900">
          {item.title}
        </h3>
        <p className="mt-1 text-[13px] leading-5 text-neutral-500">
          {item.desc}
        </p>
        <div className="mt-3 flex items-center gap-4 text-[13px] text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {item.meta.views}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {item.meta.episodes}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            {item.meta.rating}/5
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {item.tags.map((t, i) => (
            <Tag key={i} text={t.text} variant={t.variant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
