import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

class SimplexNoise {
    constructor(r = Math) {
        this.grad3 = [
            [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
        ];
        this.p = [];
        for (let i = 0; i < 256; i++) {
            this.p[i] = Math.floor(r.random() * 256);
        }
        
        this.perm = [];
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }

    dot(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    }

    noise(xin, yin, zin) {
        let n0, n1, n2, n3;
        
        const F3 = 1.0 / 3.0;
        const G3 = 1.0 / 6.0;
        
        let s = (xin + yin + zin) * F3;
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);
        let k = Math.floor(zin + s);
        
        let t = (i + j + k) * G3;
        let X0 = i - t;
        let Y0 = j - t;
        let Z0 = k - t;
        
        let x0 = xin - X0;
        let y0 = yin - Y0;
        let z0 = zin - Z0;
        
        let i1, j1, k1;
        let i2, j2, k2;
        
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0;
                i2 = 1; j2 = 1; k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0;
                i2 = 1; j2 = 0; k2 = 1;
            } else {
                i1 = 0; j1 = 0; k1 = 1;
                i2 = 1; j2 = 0; k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0; j1 = 0; k1 = 1;
                i2 = 0; j2 = 1; k2 = 1;
            } else if (x0 < z0) {
                i1 = 0; j1 = 1; k1 = 0;
                i2 = 0; j2 = 1; k2 = 1;
            } else {
                i1 = 0; j1 = 1; k1 = 0;
                i2 = 1; j2 = 1; k2 = 0;
            }
        }
        
        let x1 = x0 - i1 + G3;
        let y1 = y0 - j1 + G3;
        let z1 = z0 - k1 + G3;
        let x2 = x0 - i2 + 2.0 * G3;
        let y2 = y0 - j2 + 2.0 * G3;
        let z2 = z0 - k2 + 2.0 * G3;
        let x3 = x0 - 1.0 + 3.0 * G3;
        let y3 = y0 - 1.0 + 3.0 * G3;
        let z3 = z0 - 1.0 + 3.0 * G3;
        
        let ii = i & 255;
        let jj = j & 255;
        let kk = k & 255;
        
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            let gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
        }
        
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            let gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
        }
        
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            let gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
        }
        
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            let gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
            t3 *= t3;
            n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
        }
        
        return 32.0 * (n0 + n1 + n2 + n3);
    }
}

const NoiseVertex3D = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sphereRef = useRef(null);
    const frameIdRef = useRef(null);
    const noiseRef = useRef(new SimplexNoise());
    const [isPointerDown, setIsPointerDown] = useState(false);
    const lastPointerPosRef = useRef({ x: 0, y: 0 });
    const vertexStatesRef = useRef([]);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const mount = mountRef.current;
        
    // Set renderer size to window size
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x1a1a1a);
        mount.appendChild(renderer.domElement);

    // Add resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: true,
            wireframeLinewidth: 2
        });
        const sphere = new THREE.Mesh(geometry, material);

        const numVertices = geometry.attributes.position.count;
        vertexStatesRef.current = new Array(numVertices).fill().map(() => ({
            isFrozen: false,
            frozenNoiseValue: 0
        }));
        
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(2, 2, 2);
        const ambientLight = new THREE.AmbientLight(0x404040);
        
        scene.add(sphere);
        scene.add(light);
        scene.add(ambientLight);
        
        camera.position.z = 3;
        
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        sphereRef.current = sphere;

        const getPointerPosition = (event) => {
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

        const updateVertexStates = (pointer) => {
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
                    if (!vertexStatesRef.current[vertexIndex].isFrozen) {
                        vertexStatesRef.current[vertexIndex] = {
                            isFrozen: true,
                            frozenNoiseValue: noiseRef.current.noise(
                                vertices[i] * 0.5,
                                vertices[i + 1] * 0.5,
                                vertices[i + 2] * 0.5
                            )
                        };
                    }
                } else {
                    vertexStatesRef.current[vertexIndex].isFrozen = false;
                }
            }
        };

        const handlePointerMove = (event) => {
            event.preventDefault();
            const pointer = getPointerPosition(event);

            if (isPointerDown) {
                const deltaX = pointer.x - lastPointerPosRef.current.x;
                const deltaY = pointer.y - lastPointerPosRef.current.y;
                sphere.rotation.y += deltaX * 2;
                sphere.rotation.x += deltaY * 2;
            }

            updateVertexStates(pointer);
            lastPointerPosRef.current = pointer;
        };

        const handlePointerDown = (event) => {
            event.preventDefault();
            setIsPointerDown(true);
            const pointer = getPointerPosition(event);
            lastPointerPosRef.current = pointer;
        };

        const handlePointerUp = (event) => {
            event.preventDefault();
            setIsPointerDown(false);
        };

        const canvas = renderer.domElement;
        
        canvas.addEventListener('mousemove', handlePointerMove);
        canvas.addEventListener('mousedown', handlePointerDown);
        canvas.addEventListener('mouseup', handlePointerUp);
        canvas.addEventListener('mouseleave', handlePointerUp);
        
        canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
        canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
        canvas.addEventListener('touchend', handlePointerUp, { passive: false });
        canvas.addEventListener('touchcancel', handlePointerUp, { passive: false });

        let frame = 0;
        const animate = () => {
            frame += 0.01;
            
            const positions = sphere.geometry.attributes.position;
            const vertices = positions.array;
            
            for(let i = 0; i < vertices.length; i += 3) {
                const vertexIndex = i / 3;
                const vertexState = vertexStatesRef.current[vertexIndex];
                
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
            frameIdRef.current = requestAnimationFrame(animate);
        };
        
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);  // Add this line first
            
            cancelAnimationFrame(frameIdRef.current);
            canvas.removeEventListener('mousemove', handlePointerMove);
            canvas.removeEventListener('mousedown', handlePointerDown);
            canvas.removeEventListener('mouseup', handlePointerUp);
            canvas.removeEventListener('mouseleave', handlePointerUp);
            
            canvas.removeEventListener('touchmove', handlePointerMove);
            canvas.removeEventListener('touchstart', handlePointerDown);
            canvas.removeEventListener('touchend', handlePointerUp);
            canvas.removeEventListener('touchcancel', handlePointerUp);
            
            if (mount) {
                mount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [isPointerDown]);

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-900">
            <div 
                ref={mountRef} 
                className="w-full h-full cursor-move touch-none select-none"
            />
        </div>
    );
};

export default NoiseVertex3D;