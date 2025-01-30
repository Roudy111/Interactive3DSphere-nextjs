import * as THREE from 'three';
import { ProjectMesh } from './sceneSetup';

// Create geometries for different project types
export const createProjectGeometries = (): ProjectMesh[] => {
    const geometries: ProjectMesh[] = [];
    
    // Custom shader material for glow effect
    const glowMaterial = (color: number) => new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(color) },
            viewVector: { value: new THREE.Vector3() }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, 1.0);
            }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    // VR Project - Icosahedron
    const vrGeometry = new THREE.IcosahedronGeometry(0.2);
    const vrMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        wireframe: true
    });
    const vrMesh = new THREE.Mesh(vrGeometry, vrMaterial) as ProjectMesh;
    vrMesh.position.set(0.5, 0.3, 0);
    vrMesh.userData = { 
        type: 'project',
        projectId: 'vr',
        glowMaterial: glowMaterial(0x00ff88)
    };

    // MR Projects - Octahedrons
    const mrGeometry1 = new THREE.OctahedronGeometry(0.15);
    const mrMaterial1 = new THREE.MeshPhongMaterial({
        color: 0xff3366,
        wireframe: true
    });
    const mrMesh1 = new THREE.Mesh(mrGeometry1, mrMaterial1) as ProjectMesh;
    mrMesh1.position.set(-0.4, -0.3, 0.2);
    mrMesh1.userData = { 
        type: 'project',
        projectId: 'mr1',
        glowMaterial: glowMaterial(0xff3366)
    };

    const mrGeometry2 = new THREE.OctahedronGeometry(0.15);
    const mrMaterial2 = new THREE.MeshPhongMaterial({
        color: 0x3366ff,
        wireframe: true
    });
    const mrMesh2 = new THREE.Mesh(mrGeometry2, mrMaterial2) as ProjectMesh;
    mrMesh2.position.set(0.2, -0.4, -0.3);
    mrMesh2.userData = { 
        type: 'project',
        projectId: 'mr2',
        glowMaterial: glowMaterial(0x3366ff)
    };

    // Game Project - Dodecahedron
    const gameGeometry = new THREE.DodecahedronGeometry(0.18);
    const gameMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        wireframe: true
    });
    const gameMesh = new THREE.Mesh(gameGeometry, gameMaterial) as ProjectMesh;
    gameMesh.position.set(-0.2, 0.4, 0.1);
    gameMesh.userData = { 
        type: 'project',
        projectId: 'game',
        glowMaterial: glowMaterial(0xffaa00)
    };

    geometries.push(vrMesh, mrMesh1, mrMesh2, gameMesh);
    return geometries;
};

// Handle hover and click interactions
export const handleProjectInteractions = (
    raycaster: THREE.Raycaster,
    camera: THREE.Camera,
    projects: ProjectMesh[]
): ProjectMesh | null => {
    raycaster.setFromCamera(new THREE.Vector2(), camera);
    const intersects = raycaster.intersectObjects(projects);

    // Reset all projects not being interacted with
    projects.forEach(project => {
        project.material = project.material as THREE.MeshPhongMaterial;
    });

    if (intersects.length > 0) {
        const project = intersects[0].object as ProjectMesh;
        // Apply glow effect
        project.material = project.userData.glowMaterial;
        project.userData.glowMaterial.uniforms.viewVector.value = 
            new THREE.Vector3().subVectors(camera.position, project.position);
        return project;
    }

    return null;
};

// Animate project selection
export const animateProjectSelection = (
    project: ProjectMesh,
    camera: THREE.Camera,
    onComplete: (projectId: string) => void
): void => {
    const startPos = camera.position.clone();
    const targetPos = project.position.clone().multiplyScalar(2);
    const duration = 1000; // ms
    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easing = 1 - Math.pow(1 - progress, 3);
        
        // Update camera position
        camera.position.lerpVectors(startPos, targetPos, easing);
        
        // Update glow intensity
        if (project.userData.glowMaterial) {
            project.material = project.userData.glowMaterial;
            project.userData.glowMaterial.uniforms.viewVector.value = 
                new THREE.Vector3().subVectors(camera.position, project.position);
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            onComplete(project.userData.projectId);
        }
    };

    animate();
};
