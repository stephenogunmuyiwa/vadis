// data/projects.ts
import { Project } from "@/types/investor/project";

export const projects: Project[] = [
  {
    id: "1",
    slug: "the-matrix-remastered",
    title: "The Matrix Remastered",
    tagline:
      "The iconic sci-fi classic rebuilt with enhanced visuals and sound for a new generation of viewers.",
    description: [
      "Matrix Remastered brings the groundbreaking 1999 sci-fi classic back to life with enhanced visuals, remastered sound, and modern cinematic upgrades. This definitive edition reintroduces audiences to the iconic story of Neo, a hacker who discovers the world around him is a simulated reality controlled by machines. Combining philosophical depth with thrilling action, Matrix Remastered offers both longtime fans and new audiences an immersive experience that feels fresh while honoring the original vision.",
      "Matrix Remastered brings the groundbreaking 1999 sci-fi classic back to life with enhanced visuals, remastered sound, and modern cinematic upgrades. This definitive edition reintroduces audiences to the iconic story of Neo, a hacker who discovers the world around him is a simulated reality controlled by machines. Combining philosophical depth with thrilling action, Matrix Remastered offers both longtime fans and new audiences an immersive experience that feels fresh while honoring the original vision."
    ],
    image:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop",
    stats: { docs: 224, collaborators: 12, rating: 3.5 },
    tags: { content: "Film", genre: "Action", audience: "Adults" },
    productionCost: 2000000,
    posters: [
      "https://images.unsplash.com/photo-1526178613959-9914a91aeb98?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535141192574-5a605a2a9b0a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495562569060-2eec283d3391?q=80&w=1200&auto=format&fit=crop"
    ],
  },
  {
    id: "2",
    slug: "percy-jackson",
    title: "Percy Jackson",
    tagline:
      "The epic journey of a modern-day demigod who discovers his true identity and battles mythical forces to save the world.",
    description: [
      "Percy Jackson follows the journey of a seemingly ordinary teenager who discovers he is the son of Poseidon, god of the sea. Thrust into a world of Greek mythology come to life, Percy must navigate a hidden realm of gods, monsters, and ancient prophecies. As he trains at Camp Half-Blood and embarks on a dangerous quest to prevent an all-out war among the Olympian gods, Percy learns the true meaning of heroism, friendship, and destiny.",
      "Percy Jackson follows the journey of a seemingly ordinary teenager who discovers he is the son of Poseidon, god of the sea. Thrust into a world of Greek mythology come to life, Percy must navigate a hidden realm of gods, monsters, and ancient prophecies. As he trains at Camp Half-Blood and embarks on a dangerous quest to prevent an all-out war among the Olympian gods, Percy learns the true meaning of heroism, friendship, and destiny."
    ],
    image:
      "https://images.unsplash.com/photo-1517512006864-7edc3b933137?q=80&w=1600&auto=format&fit=crop",
    stats: { docs: 224, collaborators: 12, rating: 3.5 },
    tags: { content: "Series", genre: "Fantasy", audience: "Everyone" },
    productionCost: 2000000,
  },
  {
    id: "3",
    slug: "spiderman-a-new-home",
    title: "Spiderman: A new home",
    tagline:
      "A thrilling chapter in the Spiderman saga where Peter faces new challenges while redefining what ‘home’ truly means.",
    description: [
      "A thrilling chapter in the Spiderman saga where Peter faces new challenges while redefining what ‘home’ truly means."
    ],
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1600&auto=format&fit=crop",
    stats: { docs: 224, collaborators: 12, rating: 3.5 },
    tags: { content: "Film", genre: "Action", audience: "Everyone" },
    productionCost: 2000000,
  },
];
