import * as THREE from 'three';
import { RefObject, Dispatch, SetStateAction, MutableRefObject } from 'react';
import SimplexNoise from './SimplexNoise';
import { SphereWithStates } from './sceneSetup';

export const createVertexStateUpdater = (_noiseRef: RefObject<SimplexNoise>) => {
    return (sphere: SphereWithStates, pointer: { x: number; y: number }) => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(pointer.x, pointer.y);
        const camera = sphere.parent?.parent;
        
        if (!(camera instanceof THREE.Camera)) return;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([sphere as THREE.Object3D]);

        if (intersects.length > 0) {
            const faceIndex = intersects[0].faceIndex;
            if (faceIndex !== undefined && sphere.geometry.index) {
                const vertexIndices = [
                    sphere.geometry.index.getX(faceIndex * 3),
                    sphere.geometry.index.getX(faceIndex * 3 + 1),
                    sphere.geometry.index.getX(faceIndex * 3 + 2)
                ];

                vertexIndices.forEach(index => {
                    if (index !== undefined) {
                        sphere.userData.vertexStates[index].isFrozen = true;
                    }
                });
            }
        }
    };
};

export const createEventHandlers = (
    sphere: SphereWithStates,
    camera: THREE.Camera,
    lastPointerPosRef: MutableRefObject<{ x: number; y: number } | null>,
    setIsPointerDown: Dispatch<SetStateAction<boolean>>,
    updateVertexStates: (sphere: SphereWithStates, pointer: { x: number; y: number }) => void
) => {
    const handlePointerDown = (event: PointerEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        lastPointerPosRef.current = { x, y };
        setIsPointerDown(true);
        updateVertexStates(sphere, { x, y });
    };

    const handlePointerMove = (event: PointerEvent) => {
        if (!lastPointerPosRef.current) return;
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        lastPointerPosRef.current = { x, y };
        updateVertexStates(sphere, { x, y });
    };

    const handlePointerUp = () => {
        lastPointerPosRef.current = null;
        setIsPointerDown(false);
    };

    const attachEventListeners = (domElement: HTMLCanvasElement, _renderer: THREE.WebGLRenderer) => {
        domElement.addEventListener('pointerdown', handlePointerDown);
        domElement.addEventListener('pointermove', handlePointerMove);
        domElement.addEventListener('pointerup', handlePointerUp);
        domElement.addEventListener('pointerleave', handlePointerUp);

        return () => {
            domElement.removeEventListener('pointerdown', handlePointerDown);
            domElement.removeEventListener('pointermove', handlePointerMove);
            domElement.removeEventListener('pointerup', handlePointerUp);
            domElement.removeEventListener('pointerleave', handlePointerUp);
        };
    };

    return { attachEventListeners };
};
