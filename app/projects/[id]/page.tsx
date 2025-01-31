'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const projectData = {
  vr: {
    title: 'VR University Project',
    description: 'Virtual Reality experience developed during university studies.',
  },
  mr1: {
    title: 'Mixed Reality Hackathon Project 1',
    description: 'Mixed Reality experience created during a hackathon event.',
  },
  mr2: {
    title: 'Mixed Reality Hackathon Project 2',
    description: 'Second Mixed Reality project from hackathon participation.',
  },
  game: {
    title: 'Extensible Game System',
    description: 'A mini game with maintainable and extensible architecture.',
  },
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const project = projectData[params.id as keyof typeof projectData];

  useEffect(() => {
    if (!project) {
      router.push('/');
    }
  }, [project, router]);

  if (!project) return null;

  return (
    <main className="project-page">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <button onClick={() => router.push('/')}>Back to Portfolio</button>

      <style jsx>{`
        .project-page {
          min-height: 100vh;
          padding: 2rem;
          background: #1a1a1a;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.2rem;
          line-height: 1.6;
          max-width: 800px;
        }

        button {
          margin-top: 2rem;
          padding: 0.8rem 1.6rem;
          background: transparent;
          border: 2px solid white;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button:hover {
          background: white;
          color: #1a1a1a;
        }
      `}</style>
    </main>
  );
}
