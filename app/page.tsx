import dynamic from 'next/dynamic'

const NoiseVertex3D = dynamic(() => import('../components/NoiseVertex3D'), {
  ssr: false
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NoiseVertex3D />
    </div>
  )
}
