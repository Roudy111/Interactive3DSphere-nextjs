'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="error-container">
      <h1>Something went wrong</h1>
      <p>We couldn't load the project you're looking for.</p>
      <div className="buttons">
        <button onClick={() => reset()}>Try again</button>
        <button onClick={() => router.push('/')}>Return to Portfolio</button>
      </div>

      <style jsx>{`
        .error-container {
          min-height: 100vh;
          padding: 2rem;
          background: #1a1a1a;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.8;
        }

        .buttons {
          display: flex;
          gap: 1rem;
        }

        button {
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
    </div>
  );
}
