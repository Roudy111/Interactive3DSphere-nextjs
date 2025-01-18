'use client';  // Add this line at the top

import dynamic from 'next/dynamic'

const NoiseVertex3D = dynamic(() => import('../components/NoiseVertex3D'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NoiseVertex3D />
    </div>
  )
}
