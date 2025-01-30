import * as THREE from 'three';
import { MutableRefObject } from 'react';
import SimplexNoise from './SimplexNoise';

interface VertexState {
    isFrozen: boolean;
    frozenNoiseValue?: number;
}

import { SphereMesh } from './sceneSetup';

export const createEventHandlers = (
    sphere: SphereMesh,
    camera: THREE.Camera,
    lastPointerPosRef: MutableRefObject<{ x: number; y: number } | null>,
    setIsPointerDown: (isDown: boolean) => void,
    updateVertexStates: (pointer: { x: number; y: number }, sphere: SphereMesh, camera: THREE.Camera) => void
) => {
    const getPointerPosition = (event: MouseEvent | TouchEvent, renderer: THREE.WebGLRenderer) => {
        const rect = renderer.domElement.getBoundingClientRect();
        let clientX: number, clientY: number;

        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((clientY - rect.top) / rect.height) * 2 + 1;

        return { x, y };
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent, renderer: THREE.WebGLRenderer) => {
        event.preventDefault();
        const pointer = getPointerPosition(event, renderer);

        if (lastPointerPosRef.current && sphere.userData.isPointerDown) {
            const deltaX = pointer.x - lastPointerPosRef.current.x;
            const deltaY = pointer.y - lastPointerPosRef.current.y;
            sphere.rotation.y += deltaX * 2;
            sphere.rotation.x += deltaY * 2;
        }

        updateVertexStates(pointer, sphere, camera);
        lastPointerPosRef.current = pointer;
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent, renderer: THREE.WebGLRenderer) => {
        event.preventDefault();
        sphere.userData.isPointerDown = true;
        setIsPointerDown(true);
        const pointer = getPointerPosition(event, renderer);
        lastPointerPosRef.current = pointer;
    };

    const handlePointerUp = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        sphere.userData.isPointerDown = false;
        setIsPointerDown(false);
    };

    const attachEventListeners = (canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer) => {
        const boundPointerMove = (e: MouseEvent | TouchEvent) => handlePointerMove(e, renderer);
        const boundPointerDown = (e: MouseEvent | TouchEvent) => handlePointerDown(e, renderer);
        const boundPointerUp = handlePointerUp;

        // Mouse events
        canvas.addEventListener('mousemove', boundPointerMove as (e: MouseEvent) => void);
        canvas.addEventListener('mousedown', boundPointerDown as (e: MouseEvent) => void);
        canvas.addEventListener('mouseup', boundPointerUp as (e: MouseEvent) => void);
        canvas.addEventListener('mouseleave', boundPointerUp as (e: MouseEvent) => void);

        // Touch events
        canvas.addEventListener('touchmove', boundPointerMove as (e: TouchEvent) => void, { passive: false });
        canvas.addEventListener('touchstart', boundPointerDown as (e: TouchEvent) => void, { passive: false });
        canvas.addEventListener('touchend', boundPointerUp as (e: TouchEvent) => void, { passive: false });
        canvas.addEventListener('touchcancel', boundPointerUp as (e: TouchEvent) => void, { passive: false });

        // Return cleanup function
        return () => {
            canvas.removeEventListener('mousemove', boundPointerMove as (e: MouseEvent) => void);
            canvas.removeEventListener('mousedown', boundPointerDown as (e: MouseEvent) => void);
            canvas.removeEventListener('mouseup', boundPointerUp as (e: MouseEvent) => void);
            canvas.removeEventListener('mouseleave', boundPointerUp as (e: MouseEvent) => void);

            canvas.removeEventListener('touchmove', boundPointerMove as (e: TouchEvent) => void);
            canvas.removeEventListener('touchstart', boundPointerDown as (e: TouchEvent) => void);
            canvas.removeEventListener('touchend', boundPointerUp as (e: TouchEvent) => void);
            canvas.removeEventListener('touchcancel', boundPointerUp as (e: TouchEvent) => void);
        };
    };

    return {
        getPointerPosition,
        handlePointerMove,
        handlePointerDown,
        handlePointerUp,
        attachEventListeners
    };
};

// Utility function for vertex state updates
export const createVertexStateUpdater = (noiseRef: MutableRefObject<SimplexNoise>) => {
    return (pointer: { x: number; y: number }, sphere: SphereMesh, camera: THREE.Camera) => {
        const positions = sphere.geometry.attributes.position;
        const vertices = positions.array;
        
        for(let i = 0; i < vertices.length; i += 3) {
            const vertexIndex = i / 3;
            const vertex = new THREE.Vector3(
                vertices[i] as number,
                vertices[i + 1] as number,
                vertices[i + 2] as number
            );
            
            vertex.applyMatrix4(sphere.matrixWorld);
            const projectedVertex = vertex.project(camera);
            
            const distanceToPointer = Math.sqrt(
                Math.pow(projectedVertex.x - pointer.x, 2) + 
                Math.pow(projectedVertex.y - pointer.y, 2)
            );
            
            if (distanceToPointer < 0.2) {
                if (!sphere.userData.vertexStates[vertexIndex].isFrozen) {
                    sphere.userData.vertexStates[vertexIndex] = {
                        isFrozen: true,
                        frozenNoiseValue: noiseRef.current.noise(
                            vertices[i] as number * 0.5,
                            vertices[i + 1] as number * 0.5,
                            vertices[i + 2] as number * 0.5
                        )
                    };
                }
            } else {
                sphere.userData.vertexStates[vertexIndex].isFrozen = false;
            }
        }
    };
};
