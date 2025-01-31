import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ProjectMesh } from './sceneSetup';

// Create geometries for different project types
export const createProjectGeometries = (): ProjectMesh[] => {
    const geometries: ProjectMesh[] = [];
    
    // VR Project - Icosahedron
    const vrGeometry = new THREE.IcosahedronGeometry(0.2);
    const vrMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0,
        wireframe: true
    });
    const vrMesh = new THREE.Mesh(vrGeometry, vrMaterial) as ProjectMesh;
    vrMesh.position.set(0.5, 0.3, 0);
    vrMesh.userData = { 
        type: 'project',
        projectId: 'vr',
        originalEmissive: 0x00ff88,
        baseEmissiveIntensity: 0,
        targetEmissiveIntensity: 2
    };

    // MR Projects - Octahedrons
    const mrGeometry1 = new THREE.OctahedronGeometry(0.15);
    const mrMaterial1 = new THREE.MeshPhongMaterial({
        color: 0xff3366,
        emissive: 0xff3366,
        emissiveIntensity: 0,
        wireframe: true
    });
    const mrMesh1 = new THREE.Mesh(mrGeometry1, mrMaterial1) as ProjectMesh;
    mrMesh1.position.set(-0.4, -0.3, 0.2);
    mrMesh1.userData = { 
        type: 'project',
        projectId: 'mr1',
        originalEmissive: 0xff3366,
        baseEmissiveIntensity: 0,
        targetEmissiveIntensity: 2
    };

    const mrGeometry2 = new THREE.OctahedronGeometry(0.15);
    const mrMaterial2 = new THREE.MeshPhongMaterial({
        color: 0x3366ff,
        emissive: 0x3366ff,
        emissiveIntensity: 0,
        wireframe: true
    });
    const mrMesh2 = new THREE.Mesh(mrGeometry2, mrMaterial2) as ProjectMesh;
    mrMesh2.position.set(0.2, -0.4, -0.3);
    mrMesh2.userData = { 
        type: 'project',
        projectId: 'mr2',
        originalEmissive: 0x3366ff,
        baseEmissiveIntensity: 0,
        targetEmissiveIntensity: 2
    };

    // Game Project - Dodecahedron
    const gameGeometry = new THREE.DodecahedronGeometry(0.18);
    const gameMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 0,
        wireframe: true
    });
    const gameMesh = new THREE.Mesh(gameGeometry, gameMaterial) as ProjectMesh;
    gameMesh.position.set(-0.2, 0.4, 0.1);
    gameMesh.userData = { 
        type: 'project',
        projectId: 'game',
        originalEmissive: 0xffaa00,
        baseEmissiveIntensity: 0,
        targetEmissiveIntensity: 2
    };

    geometries.push(vrMesh, mrMesh1, mrMesh2, gameMesh);
    return geometries;
};

// Setup post-processing for glow effect
export const setupPostProcessing = (
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
): EffectComposer => {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,  // bloom strength
        0.4,  // bloom radius
        0.85  // bloom threshold
    );
    composer.addPass(bloomPass);

    return composer;
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
        if (!intersects.find((intersect: THREE.Intersection) => intersect.object === project)) {
            project.material.emissiveIntensity = project.userData.baseEmissiveIntensity;
        }
    });

    if (intersects.length > 0) {
        const project = intersects[0].object as ProjectMesh;
        project.material.emissiveIntensity = 0.5; // Hover glow
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
        
        // Update project glow
        project.material.emissiveIntensity = 
            project.userData.baseEmissiveIntensity + 
            (project.userData.targetEmissiveIntensity - project.userData.baseEmissiveIntensity) * easing;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            onComplete(project.userData.projectId);
        }
    };

    animate();
};
