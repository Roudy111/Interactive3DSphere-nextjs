import * as THREE from 'three';

export const createEventHandlers = (sphere, camera, lastPointerPosRef, setIsPointerDown, updateVertexStates) => {
    const getPointerPosition = (event, renderer) => {
        const rect = renderer.domElement.getBoundingClientRect();
        let clientX, clientY;

        if (event.touches) {
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

    const handlePointerMove = (event, renderer) => {
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

    const handlePointerDown = (event, renderer) => {
        event.preventDefault();
        sphere.userData.isPointerDown = true;
        setIsPointerDown(true);
        const pointer = getPointerPosition(event, renderer);
        lastPointerPosRef.current = pointer;
    };

    const handlePointerUp = (event) => {
        event.preventDefault();
        sphere.userData.isPointerDown = false;
        setIsPointerDown(false);
    };

    const attachEventListeners = (canvas, renderer) => {
        const boundPointerMove = (e) => handlePointerMove(e, renderer);
        const boundPointerDown = (e) => handlePointerDown(e, renderer);
        const boundPointerUp = handlePointerUp;

        // Mouse events
        canvas.addEventListener('mousemove', boundPointerMove);
        canvas.addEventListener('mousedown', boundPointerDown);
        canvas.addEventListener('mouseup', boundPointerUp);
        canvas.addEventListener('mouseleave', boundPointerUp);

        // Touch events
        canvas.addEventListener('touchmove', boundPointerMove, { passive: false });
        canvas.addEventListener('touchstart', boundPointerDown, { passive: false });
        canvas.addEventListener('touchend', boundPointerUp, { passive: false });
        canvas.addEventListener('touchcancel', boundPointerUp, { passive: false });

        // Return cleanup function
        return () => {
            canvas.removeEventListener('mousemove', boundPointerMove);
            canvas.removeEventListener('mousedown', boundPointerDown);
            canvas.removeEventListener('mouseup', boundPointerUp);
            canvas.removeEventListener('mouseleave', boundPointerUp);

            canvas.removeEventListener('touchmove', boundPointerMove);
            canvas.removeEventListener('touchstart', boundPointerDown);
            canvas.removeEventListener('touchend', boundPointerUp);
            canvas.removeEventListener('touchcancel', boundPointerUp);
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
export const createVertexStateUpdater = (noiseRef) => {
    return (pointer, sphere, camera) => {
        const positions = sphere.geometry.attributes.position;
        const vertices = positions.array;
        
        for(let i = 0; i < vertices.length; i += 3) {
            const vertexIndex = i / 3;
            const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            
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
                            vertices[i] * 0.5,
                            vertices[i + 1] * 0.5,
                            vertices[i + 2] * 0.5
                        )
                    };
                }
            } else {
                sphere.userData.vertexStates[vertexIndex].isFrozen = false;
            }
        }
    };
};
