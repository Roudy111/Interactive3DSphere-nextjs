declare module 'react' {
    export * from 'react';

    export type RefObject<T> = {
        readonly current: T | null;
    };

    export type MutableRefObject<T> = {
        current: T;
    };

    export type SetStateAction<S> = S | ((prevState: S) => S);
    export type Dispatch<A> = (value: A) => void;

    export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
    export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

    export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;

    export function useRef<T>(initialValue: T): MutableRefObject<T>;
    export function useRef<T>(initialValue: T | null): RefObject<T>;
    export function useRef<T = undefined>(): MutableRefObject<T | undefined>;

    export const Suspense: React.ComponentType<{
        children?: React.ReactNode;
        fallback?: React.ReactNode;
    }>;

    export type PropsWithChildren<P = unknown> = P & { children?: React.ReactNode };

    export interface FunctionComponent<P = {}> {
        (props: PropsWithChildren<P>, context?: any): React.ReactElement<any, any> | null;
        displayName?: string;
    }

    export type FC<P = {}> = FunctionComponent<P>;

    export type ReactNode =
        | React.ReactElement
        | string
        | number
        | boolean
        | null
        | undefined
        | React.ReactNodeArray;

    export interface ReactElement<
        P = any,
        T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>
    > {
        type: T;
        props: P;
        key: React.Key | null;
    }

    export type JSXElementConstructor<P> =
        | ((props: P) => ReactElement<any, any> | null)
        | (new (props: P) => React.Component<P, any>);

    export type Key = string | number;

    export type ReactNodeArray = Array<ReactNode>;

    export class Component<P = {}, S = {}, SS = any> {
        constructor(props: P);
        setState<K extends keyof S>(
            state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
            callback?: () => void
        ): void;
        forceUpdate(callback?: () => void): void;
        render(): ReactNode;
        readonly props: Readonly<P>;
        state: Readonly<S>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    }
}
