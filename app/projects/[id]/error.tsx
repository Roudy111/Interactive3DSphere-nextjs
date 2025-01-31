'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Project page error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.description}>We couldn't load the project you're looking for.</p>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => reset()}>Try again</button>
        <button className={styles.button} onClick={() => router.push('/')}>Return to Portfolio</button>
      </div>
    </div>
  );
}
