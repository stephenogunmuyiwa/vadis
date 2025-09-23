import { PitchDeckItem, ScriptItem } from '@/types/creator/creator';

export const seedScripts: ScriptItem[] = [
  {
    id: 's1',
    name: 'Echoes of Tomorrow',
    genre: 'Action',
    audience: 'Adults',
    content: 'Movie',
    description:
      'In a world where memories can be traded, a young archivist uncovers a dangerous secret that could change the past — and the future.',
    pages: 224,
    collaborators: 12,
    tags: ['Action', 'Film', 'Adults'],
  },
];

export const duplicateToGrid = (count = 8): ScriptItem[] => {
  const base = seedScripts[0];
  return Array.from({ length: count }, (_, i) => ({
    ...base,
    id: `s${i + 1}`,
  }));
};

export const seedDecks: PitchDeckItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: `d${i + 1}`,
  name: 'Echoes of Tomorrow',
  fromScriptId: 's1',
  colorTheme: 'Fantasy',
  createdAt: new Date().toISOString(),
}));
