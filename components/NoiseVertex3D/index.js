import React, { useEffect, useRef, useState } from 'react';
import { SimplexNoise } from './SimplexNoise';
import { createScene, createSphere, setupLights } from './sceneSetup';
import { createEventHandlers, createVertexStateUpdater } from './eventHandlers';
import { createAnimationLoop } from './animation';

const NoiseVertex3D = () => {
    // Refs setup
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sphereRef = useRef(null);
    const frameIdRef = useRef(null);
    const noiseRef = useRef(new SimplexNoise());
    const lastPointerPosRef = useRef({ x: 0, y: 0 });

    // State setup
    const [isPointerDown, setIsPointerDown] = useState(false);

    useEffect(() => {
        // Create basic scene elements
        const { scene, camera, renderer } = createScene();
        const sphere = createSphere();
        setupLights(scene);

        // Store references
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        sphereRef.current = sphere;

        // Initialize sphere
        scene.add(sphere);
        
        // Setup mount
        const mount = mountRef.current;
        mount.appendChild(renderer.domElement);

        // Initialize vertex states in sphere's userData
        const numVertices = sphere.geometry.attributes.position.count;
        sphere.userData.vertexStates = new Array(numVertices).fill().map(() => ({
            isFrozen: false,
            frozenNoiseValue: 0
        }));

        // Setup event handlers
        const vertexStateUpdater = createVertexStateUpdater(noiseRef);
        const eventHandlers = createEventHandlers(
            sphere,
            camera,
            lastPointerPosRef,
            setIsPointerDown,
            vertexStateUpdater
        );

        // Attach event listeners
        const cleanupEvents = eventHandlers.attachEventListeners(renderer.domElement, renderer);

        // Setup and start animation
        const animate = createAnimationLoop(sphere, renderer, scene, camera, noiseRef, isPointerDown);
        frameIdRef.current = requestAnimationFrame(animate);

        // Setup resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            cleanupEvents();
            cancelAnimationFrame(frameIdRef.current);
            
            if (mount) {
                mount.removeChild(renderer.domElement);
            }

            // Dispose of Three.js resources
            sphere.geometry.dispose();
            sphere.material.dispose();
            renderer.dispose();
        };
    }, [isPointerDown]);

return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-gray-900">
        <div 
            ref={mountRef} 
            className="w-full h-full touch-none select-none"
            style={{ width: '100vw', height: '100vh' }}
        />
    </div>
);

export default NoiseVertex3D;
