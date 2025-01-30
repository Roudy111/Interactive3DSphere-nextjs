import * as THREE from 'three';

export interface VertexState {
    isFrozen: boolean;
    frozenNoiseValue?: number;
}

export interface ProjectMeshUserData {
    type: 'project';
    projectId: string;
    originalEmissive: number;
    baseEmissiveIntensity: number;
    targetEmissiveIntensity: number;
}

export interface SphereUserData {
    isPointerDown: boolean;
    vertexStates: VertexState[];
}

export interface BaseMesh extends THREE.Mesh {
    geometry: THREE.BufferGeometry;
    material: THREE.Material & {
        emissiveIntensity: number;
    };
    position: THREE.Vector3;
    rotation: THREE.Euler;
    matrixWorld: THREE.Matrix4;
}

export interface ProjectMesh extends BaseMesh {
    userData: ProjectMeshUserData;
}

export interface SphereMesh extends BaseMesh {
    userData: SphereUserData;
}

export type CustomMesh = ProjectMesh | SphereMesh;

export const isProjectMesh = (mesh: CustomMesh): mesh is ProjectMesh => {
    return 'type' in mesh.userData && mesh.userData.type === 'project';
};

export const isSphereMesh = (mesh: CustomMesh): mesh is SphereMesh => {
    return 'vertexStates' in mesh.userData;
};

export const createScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    camera.position.z = 3;
    renderer.setClearColor(0x1a1a1a);
    
    return { scene, camera, renderer };
};

export const createSphere = (): SphereMesh => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        wireframeLinewidth: 2
    });
    const mesh = new THREE.Mesh(geometry, material) as SphereMesh;
    mesh.userData = {
        isPointerDown: false,
        vertexStates: Array(geometry.attributes.position.count)
            .fill(null)
            .map(() => ({ isFrozen: false }))
    };
    return mesh;
};

export const setupLights = (scene: THREE.Scene) => {
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    const ambientLight = new THREE.AmbientLight(0x404040);
    
    scene.add(light);
    scene.add(ambientLight);
};
