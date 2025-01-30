/// <reference types="react" />
/// <reference types="next" />

import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      style: DetailedHTMLProps<HTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
      main: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      html: DetailedHTMLProps<HTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
      head: DetailedHTMLProps<HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
      meta: DetailedHTMLProps<HTMLMetaElement, HTMLMetaElement>;
      body: DetailedHTMLProps<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
      h1: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      button: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    }
  }
}

declare module 'next' {
  interface Metadata {
    title?: string;
    description?: string;
    viewport?: string;
    themeColor?: string;
    openGraph?: {
      title?: string;
      description?: string;
      type?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }
}

declare module 'next/font/google' {
  interface FontOptions {
    subsets?: string[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    weight?: string | number | Array<string | number>;
    style?: 'normal' | 'italic';
  }

  export function Inter(options: FontOptions): {
    className: string;
    style: { fontFamily: string };
  };
}

declare global {
  namespace React {
    interface ReactNode {
      children?: ReactNode | undefined;
    }
  }
}

declare module 'next/navigation' {
  export interface NavigateOptions {
    scroll?: boolean;
  }

  export interface AppRouterInstance {
    push(href: string, options?: NavigateOptions): void;
    replace(href: string, options?: NavigateOptions): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(href: string): void;
  }

  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}

declare module 'next/dynamic' {
  import type { ComponentType, ReactNode } from 'react';

  export interface DynamicOptions {
    loading?: (() => ReactNode) | null;
    ssr?: boolean;
    suspense?: boolean;
  }

  export default function dynamic<P = {}>(
    dynamicOptions: () => Promise<ComponentType<P> | { default: ComponentType<P> }>,
    options?: DynamicOptions
  ): ComponentType<P>;
}

declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer } from 'three';
  export class EffectComposer {
    constructor(renderer: WebGLRenderer);
    addPass(pass: any): void;
    render(): void;
    setSize(width: number, height: number): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera } from 'three';
  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2 } from 'three';
  export class UnrealBloomPass {
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
  }
}

// Support for 'use client' directive
declare module 'client-only' {
  const clientOnly: unique symbol;
  export default clientOnly;
}

declare module 'server-only' {
  const serverOnly: unique symbol;
  export default serverOnly;
}
