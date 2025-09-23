export type SceneEditResponse =
  | { ok: true; image_url: string }
  | { ok: false; error: string };
