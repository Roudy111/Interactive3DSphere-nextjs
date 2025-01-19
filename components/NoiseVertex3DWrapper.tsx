"use client";
import dynamic from 'next/dynamic'

const NoiseVertex3D = dynamic(() => import('./NoiseVertex3D'), {
  ssr: false,
})

export default function NoiseVertex3DWrapper() {
  return <NoiseVertex3D />
}
