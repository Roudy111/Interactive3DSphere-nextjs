import NoiseVertex3DWrapper from '@/components/NoiseVertex3DWrapper';

export default function Home() {
  return (
    <main>
      <NoiseVertex3DWrapper />
    </main>
  );
}

// Disable static generation for this page
export const dynamic = 'force-dynamic';
