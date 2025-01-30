'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

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
    <main className={styles.projectPage}>
      <h1 className={styles.title}>{project.title}</h1>
      <p className={styles.description}>{project.description}</p>
      <button className={styles.button} onClick={() => router.push('/')}>
        Back to Portfolio
      </button>
    </main>
  );
}
