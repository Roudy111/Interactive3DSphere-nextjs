'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from './NoiseVertex3D/LoadingSpinner';

// Dynamically import NoiseVertex3D with SSR disabled
const NoiseVertex3D = dynamic(() => import('./NoiseVertex3D'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

interface Props {
  className?: string;
}

export default function NoiseVertex3DWrapper({ className }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NoiseVertex3D className={className} />
    </Suspense>
  );
}
