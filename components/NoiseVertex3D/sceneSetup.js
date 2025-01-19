import * as THREE from 'three';

export const createScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    camera.position.z = 3;
    renderer.setClearColor(0x1a1a1a);
    
    return { scene, camera, renderer };
};

export const createSphere = () => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        wireframeLinewidth: 2
    });
    return new THREE.Mesh(geometry, material);
};

export const setupLights = (scene) => {
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    const ambientLight = new THREE.AmbientLight(0x404040);
    
    scene.add(light);
    scene.add(ambientLight);
};
