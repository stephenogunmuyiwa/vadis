'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Project } from '@/types/creator/creator';
import { listProjects, generateProjectFromBrief } from '@/app/api/shared/creator/creator';

type Filter =
  | 'All scripts'
  | 'Action'
  | 'Fantasy'
  | 'Sci-Fi'
  | 'Drama'
  | 'Comedy'
  | 'Thriller'
  | 'Horror';

export function useProjects(userEmail?: string) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('All scripts');

  const ready = !!userEmail; // only fetch when we truly have an email

  const refresh = useCallback(async () => {
    if (!ready) return; // guard
    setLoading(true);
    setError(null);
    try {
      const data = await listProjects(userEmail!);
      setProjects(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [userEmail, ready]);

  useEffect(() => {
    if (!ready) return; // do nothing until email exists
    refresh();
  }, [ready, refresh]);

  const filtered = useMemo(() => {
    if (filter === 'All scripts') return projects;
    return projects.filter((p) =>
      (p.tags || []).some((t) => t.toLowerCase() === filter.toLowerCase())
    );
  }, [projects, filter]);

  const createFromBrief = useCallback(
    async (args: { name: string; genre: string; audience: string; description: string }) => {
      if (!ready) throw new Error('User email not available yet.');
      await generateProjectFromBrief({
        userEmail: userEmail!,
        title: args.name,
        logLine: args.description, // derived; can expose as a field later
        genre: args.genre,
        audienceRating: args.audience,
        location: 'Global',
        description: args.description,
      });
      await refresh();
    },
    [ready, userEmail, refresh]
  );

  return {
    ready,
    projects: filtered,
    rawProjects: projects,
    loading,
    error,
    filter,
    setFilter,
    refresh,
    createFromBrief,
  };
}
