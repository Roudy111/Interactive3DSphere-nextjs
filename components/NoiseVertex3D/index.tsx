'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createScene, createSphere, setupLights, ProjectMesh } from './sceneSetup';
import { createEventHandlers, createVertexStateUpdater } from './eventHandlers';
import { createProjectGeometries, setupPostProcessing, handleProjectInteractions, animateProjectSelection } from './projectGeometries';
import SimplexNoise from './SimplexNoise';

interface Props {
  className?: string;
}

export default function NoiseVertex3D({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const noiseRef = useRef<SimplexNoise>(new SimplexNoise());
  const [, setIsPointerDown] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const { scene, camera, renderer } = createScene();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create and setup sphere
    const sphere = createSphere();
    scene.add(sphere);

    // Add project geometries
    const projectGeometries = createProjectGeometries();
    projectGeometries.forEach(geometry => scene.add(geometry));

    // Setup lights
    setupLights(scene);

    // Setup post-processing
    const composer = setupPostProcessing(scene, camera, renderer);

    // Setup raycaster for project interactions
    const raycaster = new THREE.Raycaster();
    let hoveredProject: ProjectMesh | null = null;
    let isAnimating = false;

    // Event handlers
    const { attachEventListeners } = createEventHandlers(
      sphere,
      camera,
      lastPointerPosRef,
      setIsPointerDown,
      createVertexStateUpdater(noiseRef)
    );

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Click handler for project selection
    const handleClick = () => {
      if (hoveredProject && !isAnimating) {
        isAnimating = true;
        animateProjectSelection(hoveredProject, camera, (projectId: string) => {
          isAnimating = false;
          // Navigate to project page
          window.location.href = `/projects/${projectId}`;
        });
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      const positions = sphere.geometry.attributes.position;
      const vertices = positions.array;

      // Animate sphere vertices
      for (let i = 0; i < vertices.length; i += 3) {
        const vertexIndex = i / 3;
        if (!sphere.userData.vertexStates[vertexIndex].isFrozen) {
          const noise = noiseRef.current.noise(
            vertices[i] as number * 0.5 + time * 0.5,
            vertices[i + 1] as number * 0.5 + time * 0.5,
            vertices[i + 2] as number * 0.5
          );
          vertices[i + 2] += noise * 0.01;
        }
      }

      positions.needsUpdate = true;

      // Rotate project geometries
      projectGeometries.forEach((project, index) => {
        project.rotation.x += 0.001 * (index + 1);
        project.rotation.y += 0.002 * (index + 1);
      });

      // Handle project interactions if not animating
      if (!isAnimating) {
        hoveredProject = handleProjectInteractions(raycaster, camera, projectGeometries);
      }

      // Render with post-processing
      composer.render();
      requestRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    // Cleanup
    const cleanup = attachEventListeners(renderer.domElement, renderer);
    return () => {
      cleanup();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (container && renderer.domElement) {
        try {
          container.removeChild(renderer.domElement);
        } catch (e) {
          console.warn('Could not remove canvas element:', e);
        }
      }
      // Dispose of Three.js resources
      renderer.dispose();
      sphere.geometry.dispose();
      (sphere.material as THREE.Material).dispose();
      projectGeometries.forEach(project => {
        project.geometry.dispose();
        (project.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ width: '100%', height: '100vh' }} 
    />
  );
}
