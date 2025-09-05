// app/Dashboard/Project/[id]/page.tsx
import Project from "./project";

type PageProps = {
  // 👇 tell TS that params is a Promise of the shape
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const projectId = id?.trim();

  if (!projectId) {
    // optionally render not-found or redirect
    return null;
  }

  return <Project projectId={projectId} />;
}
