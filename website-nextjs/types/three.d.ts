declare module 'three' {
    export * from 'three/src/Three';
    
    export class BufferGeometry {
        constructor();
        attributes: {
            position: BufferAttribute;
            normal?: BufferAttribute;
            uv?: BufferAttribute;
        };
        index: BufferAttribute | null;
        setAttribute(name: string, attribute: BufferAttribute): this;
        getAttribute(name: string): BufferAttribute;
        dispose(): void;
    }

    export class BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number, normalized?: boolean);
        array: ArrayLike<number>;
        count: number;
        itemSize: number;
        needsUpdate: boolean;
        getX(index: number): number;
        setX(index: number, x: number): this;
    }

    export class Float32BufferAttribute extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number, normalized?: boolean);
    }

    export class Mesh<
        TGeometry extends BufferGeometry = BufferGeometry,
        TMaterial extends Material | Material[] = Material | Material[]
    > extends Object3D {
        constructor(geometry?: TGeometry, material?: TMaterial);
        geometry: TGeometry;
        material: TMaterial;
        morphTargetInfluences?: number[];
        morphTargetDictionary?: { [key: string]: number };
        updateMorphTargets(): void;
        readonly isMesh: true;
    }

    export class Vector3 {
        constructor(x?: number, y?: number, z?: number);
        x: number;
        y: number;
        z: number;
        set(x: number, y: number, z: number): this;
        clone(): Vector3;
        add(v: Vector3): Vector3;
        lerpVectors(v1: Vector3, v2: Vector3, alpha: number): this;
    }

    export class Vector2 {
        constructor(x?: number, y?: number);
        x: number;
        y: number;
    }

    export class Color {
        constructor(color?: ColorRepresentation);
        r: number;
        g: number;
        b: number;
    }

    export class BoxGeometry extends BufferGeometry {
        constructor(width?: number, height?: number, depth?: number);
    }

    export class SphereGeometry extends BufferGeometry {
        constructor(radius?: number, widthSegments?: number, heightSegments?: number);
    }

    export class MeshPhongMaterial extends Material {
        constructor(parameters?: MeshPhongMaterialParameters);
        color: Color;
        wireframe: boolean;
        wireframeLinewidth: number;
    }

    export interface MeshPhongMaterialParameters {
        color?: ColorRepresentation;
        wireframe?: boolean;
        wireframeLinewidth?: number;
        transparent?: boolean;
        opacity?: number;
    }

    export class ShaderMaterial extends Material {
        constructor(parameters?: ShaderMaterialParameters);
        uniforms: { [uniform: string]: { value: any } };
        vertexShader: string;
        fragmentShader: string;
        transparent: boolean;
        blending: Blending;
    }

    export interface ShaderMaterialParameters {
        uniforms?: { [uniform: string]: { value: any } };
        vertexShader?: string;
        fragmentShader?: string;
        transparent?: boolean;
        blending?: Blending;
    }

    export class Camera extends Object3D {
        matrixWorldInverse: Matrix4;
        projectionMatrix: Matrix4;
        projectionMatrixInverse: Matrix4;
        lookAt(target: Vector3): void;
    }

    export class PerspectiveCamera extends Camera {
        constructor(fov?: number, aspect?: number, near?: number, far?: number);
        aspect: number;
        far: number;
        filmGauge: number;
        filmOffset: number;
        focus: number;
        fov: number;
        near: number;
        zoom: number;
        updateProjectionMatrix(): void;
    }

    export class AmbientLight extends Light {
        constructor(color?: ColorRepresentation, intensity?: number);
    }

    export class PointLight extends Light {
        constructor(color?: ColorRepresentation, intensity?: number, distance?: number, decay?: number);
        position: Vector3;
    }

    export class Light extends Object3D {
        constructor(color?: ColorRepresentation, intensity?: number);
        color: Color;
        intensity: number;
    }

    export const AdditiveBlending: Blending;
    export type Blending = number;
    export type ColorRepresentation = Color | string | number;

    export class Raycaster {
        setFromCamera(coords: { x: number; y: number }, camera: Camera): void;
        intersectObject(object: Object3D, recursive?: boolean): Intersection[];
        intersectObjects(objects: Object3D[], recursive?: boolean): Intersection[];
    }

    export interface Intersection {
        distance: number;
        point: Vector3;
        face: Face | null;
        faceIndex: number;
        object: Object3D;
    }

    export interface Face {
        a: number;
        b: number;
        c: number;
        normal: Vector3;
        materialIndex: number;
    }

    export class WebGLRenderer {
        constructor(parameters?: WebGLRendererParameters);
        domElement: HTMLCanvasElement;
        setSize(width: number, height: number, updateStyle?: boolean): void;
        setPixelRatio(value: number): void;
        setClearColor(color: number | string | Color, alpha?: number): void;
        render(scene: Scene, camera: Camera): void;
        dispose(): void;
    }

    export class Scene extends Object3D {
        constructor();
        background: null | Color | Texture | number;
        environment: null | Texture;
        fog: null | Fog | FogExp2;
        overrideMaterial: null | Material;
        autoUpdate: boolean;
    }

    export class Object3D {
        constructor();
        id: number;
        uuid: string;
        name: string;
        type: string;
        parent: Object3D | null;
        children: Object3D[];
        up: Vector3;
        position: Vector3;
        rotation: Euler;
        scale: Vector3;
        visible: boolean;
        userData: any;
        add(...object: Object3D[]): this;
        remove(...object: Object3D[]): this;
    }

    export class Material {
        constructor();
        transparent: boolean;
        opacity: number;
        dispose(): void;
    }

    export class Matrix4 {
        constructor();
        elements: number[];
    }

    export class Euler {
        constructor(x?: number, y?: number, z?: number, order?: string);
        x: number;
        y: number;
        z: number;
        order: string;
    }

    export class Texture {
        constructor();
    }

    export class CubeTexture extends Texture {
        constructor();
    }

    export class Fog {
        constructor();
    }

    export class FogExp2 {
        constructor();
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
