import * as THREE from 'three';
import { ProjectMesh } from './sceneSetup';

export const createProjectGeometries = (): ProjectMesh[] => {
    const geometries: ProjectMesh[] = [];
    const projects = [
        { id: '1', position: [-2, 1, 0] },
        { id: '2', position: [2, 1, 0] },
        { id: '3', position: [0, -2, 0] }
    ];

    projects.forEach(({ id, position }) => {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material) as ProjectMesh;
        mesh.position.set(...position);
        mesh.userData = {
            type: 'project',
            projectId: id,
            glowMaterial: new THREE.ShaderMaterial({
                uniforms: {
                    glowColor: { value: new THREE.Color(0x00ff00) },
                    glowIntensity: { value: 1.0 }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 glowColor;
                    uniform float glowIntensity;
                    varying vec3 vNormal;
                    void main() {
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
                        gl_FragColor = vec4(glowColor, intensity * glowIntensity);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            })
        };

        geometries.push(mesh);
    });

    return geometries;
};

export const handleProjectInteractions = (
    raycaster: THREE.Raycaster,
    camera: THREE.Camera,
    projectGeometries: ProjectMesh[]
): ProjectMesh | null => {
    const mousePosition = new THREE.Vector2();
    raycaster.setFromCamera(mousePosition, camera);

    const intersects = raycaster.intersectObjects(projectGeometries);
    if (intersects.length > 0) {
        return intersects[0].object as ProjectMesh;
    }

    return null;
};

export const animateProjectSelection = (
    project: ProjectMesh,
    camera: THREE.Camera,
    onComplete: (projectId: string) => void
): void => {
    const startPosition = camera.position.clone();
    const targetPosition = project.position.clone().add(new THREE.Vector3(0, 0, 2));
    const duration = 1000; // ms
    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        camera.position.lerpVectors(startPosition, targetPosition, progress);
        camera.lookAt(project.position);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            onComplete(project.userData.projectId);
        }
    };

    animate();
};
