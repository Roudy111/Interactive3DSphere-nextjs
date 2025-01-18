'use client';

import dynamic from 'next/dynamic'

const NoiseVertex3D = dynamic(() => import('./NoiseVertex3D'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NoiseVertex3D />
    </div>
  )
}
