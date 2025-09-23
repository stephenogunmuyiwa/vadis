"use client";

import EmptyState from "@/components/creator/ui/EmptyState";
import Toolbar from "@/components/creator/ui/Toolbar";
import ProjectCard from "@/components/creator/cards/ProjectCard";
import { useRightSheet } from "@/hooks/creator/useRightSheet";
import GenerateScriptSheet from "./GenerateScriptSheet";
import { useProjects } from "@/hooks/creator/useProjects";
import Button from "@/components/creator/ui/Button";
import { useSession } from "@/hooks/production/useSession";
import ProjectCardSkeleton from "@/components/creator/cards/ProjectCardSkeleton";

export default function ScriptsPanel() {
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;
  const {
    ready,
    projects,
    rawProjects,
    loading,
    error,
    filter,
    setFilter,
    createFromBrief,
    refresh,
  } = useProjects(email);
  const sheet = useRightSheet<"create">();

  const hasData = (rawProjects?.length ?? 0) > 0;
  const showSkeletons = isLoading || !ready || loading;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[18px] font-normal text-neutral-800">My Scripts</h2>
        {hasData && (
          <Toolbar
            filter={filter}
            onFilter={(v) => setFilter(v as any)}
            primaryLabel="Generate script"
            onPrimary={() => sheet.show("create")}
          />
        )}
      </div>
      {/* Error / reload */}
      {!showSkeletons && error && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      )}
      {showSkeletons ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : !hasData ? (
        <EmptyState
          title="No scripts yet"
          description="Your script journey begins here. Enter a concept to generate your first draft."
          cta="Generate script"
          onClick={() => sheet.show("create")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} item={p} />
            ))}
          </div>
        </>
      )}
      <GenerateScriptSheet
        open={sheet.open}
        onClose={sheet.hide}
        onSubmit={async (v) => {
          // throws on error; the sheet will keep itself open and show the error
          await createFromBrief({
            name: v.name,
            genre: v.genre,
            audience: v.audience,
            description: v.description,
          });
        }}
      />
    </div>
  );
}
