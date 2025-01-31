/// <reference types="three" />

import {
    ShaderMaterial,
    Mesh,
    Scene,
    Camera,
    WebGLRenderer,
    Vector2,
    Vector3,
    Raycaster,
    BoxGeometry,
    SphereGeometry,
    MeshPhongMaterial,
    AmbientLight,
    PointLight,
    Color,
    Object3D,
    BufferGeometry,
    Material,
    PerspectiveCamera
} from 'three';

declare module 'three' {
    interface Object3DEventMap {
        click: MouseEvent;
        hover: MouseEvent;
    }

    interface Object3D {
        parent: Object3D | null;
        position: Vector3;
        geometry?: BufferGeometry;
        material?: Material;
    }

    interface Mesh<
        TGeometry extends BufferGeometry = BufferGeometry,
        TMaterial extends Material | Material[] = Material | Material[]
    > extends Object3D {
        geometry: TGeometry;
        material: TMaterial;
        userData: {
            [key: string]: any;
            vertexStates?: { isFrozen: boolean }[];
            type?: 'project';
            projectId?: string;
            glowMaterial?: ShaderMaterial;
        };
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            mesh: Object3D;
            scene: Scene;
            camera: Camera;
        }
    }
}

declare module '*.glsl' {
    const content: string;
    export default content;
}

declare module '*.vert' {
    const content: string;
    export default content;
}

declare module '*.frag' {
    const content: string;
    export default content;
}

declare module '*.vs' {
    const content: string;
    export default content;
}

declare module '*.fs' {
    const content: string;
    export default content;
}
