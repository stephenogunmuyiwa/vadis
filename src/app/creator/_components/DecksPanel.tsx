"use client";

import DeckCard from "@/components/creator/cards/DeckCard";
import DeckCardSkeleton from "@/components/creator/cards/DeckCardSkeleton";
import SearchInput from "@/components/creator/ui/SearchInput";
import Button from "@/components/creator/ui/Button";
import { useRightSheet } from "@/hooks/creator/useRightSheet";
import GenerateDeckSheet from "./GenerateDeckSheet";
import EmptyState from "@/components/creator/ui/EmptyState";
import { Plus } from "lucide-react";
import { useProjects } from "@/hooks/creator/useProjects";
import { useSession } from "@/hooks/production/useSession";
import { useDecks } from "@/hooks/creator/useDecks";

export default function DecksPanel() {
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  // projects provide the "Attach script" options for the sheet
  const { rawProjects, ready: projectsReady } = useProjects(email);

  // decks come from the API
  const {
    ready,
    loading,
    error,
    decks,
    rawDecks,
    query,
    setQuery,
    refresh,
    createDeck,
  } = useDecks(email);

  const sheet = useRightSheet<"create">();
  const hasData = (rawDecks?.length ?? 0) > 0;
  const showSkeletons = isLoading || !ready || loading;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[18px] font-normal text-neutral-800">
          My Pitch Decks
        </h2>

        {!showSkeletons && hasData && (
          <div className="flex items-center gap-3">
            <SearchInput value={query} onChange={setQuery} />
            <Button
              onClick={() => sheet.show("create")}
              className="ml-1 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Generate pitch deck
            </Button>
          </div>
        )}
      </div>

      {!showSkeletons && error && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      )}

      {showSkeletons ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <DeckCardSkeleton key={i} />
          ))}
        </div>
      ) : !hasData ? (
        <EmptyState
          title="No pitch decks yet"
          description="Ready to pitch? Generate a stunning deck from your script, visuals, and budget in just a few clicks."
          cta="Generate a Pitch deck"
          onClick={() => sheet.show("create")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4 lg:grid-cols-4">
          {decks.map((d) => (
            <DeckCard key={d.id} item={d} />
          ))}
        </div>
      )}

      <GenerateDeckSheet
        open={sheet.open}
        onClose={sheet.hide}
        scripts={
          (rawProjects || []).map((p) => ({
            // adapt to the Select’s expected shape (ScriptItem)
            id: p.id,
            name: p.title,
            genre: "Fantasy" as any,
            audience: "Adults" as any,
            content: "Movie" as any,
            description: p.overview || p.preview_text || "",
            pages: p.scene_count ?? 0,
            collaborators: 0,
            tags: p.tags || [],
          })) as any
        }
        onSubmit={async ({ fromScriptId }) => {
          // only send what the API needs
          if (!projectsReady || !ready)
            throw new Error("Session not ready yet.");
          await createDeck(fromScriptId);
        }}
      />
    </div>
  );
}
