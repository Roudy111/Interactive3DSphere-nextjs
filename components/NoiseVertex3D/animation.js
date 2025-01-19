export const createAnimationLoop = (sphere, renderer, scene, camera, noiseRef, isPointerDown) => {
    let frame = 0;
    
    const animate = () => {
        frame += 0.01;
            
        const positions = sphere.geometry.attributes.position;
        const vertices = positions.array;
        
        for(let i = 0; i < vertices.length; i += 3) {
            const vertexIndex = i / 3;
            const vertexState = sphere.userData.vertexStates[vertexIndex];
            
            const x = vertices[i];
            const y = vertices[i + 1];
            const z = vertices[i + 2];
            
            let noise;
            if (vertexState.isFrozen) {
                noise = vertexState.frozenNoiseValue * 0.3;
            } else {
                noise = noiseRef.current.noise(
                    x * 0.5 + frame,
                    y * 0.5 + frame,
                    z * 0.5
                ) * 0.3;
            }
            
            const normalizedX = x / Math.sqrt(x*x + y*y + z*z);
            const normalizedY = y / Math.sqrt(x*x + y*y + z*z);
            const normalizedZ = z / Math.sqrt(x*x + y*y + z*z);
            
            vertices[i] = normalizedX * (1 + noise);
            vertices[i + 1] = normalizedY * (1 + noise);
            vertices[i + 2] = normalizedZ * (1 + noise);
        }
        
        positions.needsUpdate = true;
        
        if (!isPointerDown) {
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.002;
        }
        
        renderer.render(scene, camera);
        return requestAnimationFrame(animate);
    };

    return animate;
};
