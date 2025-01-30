import * as THREE from 'three';

export interface ProjectMeshUserData {
    type: 'project';
    projectId: string;
    glowMaterial: THREE.ShaderMaterial;
}

export type ProjectMesh = THREE.Mesh & {
    userData: ProjectMeshUserData;
};

interface VertexState {
    isFrozen: boolean;
}

export const createScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    return { scene, camera, renderer };
};

export const createSphere = () => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0x444444,
        wireframe: true,
        wireframeLinewidth: 2
    });

    const sphere = new THREE.Mesh(geometry, material);
    
    // Initialize vertex states
    sphere.userData.vertexStates = new Array(geometry.attributes.position.count)
        .fill(null)
        .map(() => ({ isFrozen: false }));

    return sphere;
};

export const setupLights = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
};
