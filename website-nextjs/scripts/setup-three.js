const fs = require('fs');
const path = require('path');

// Ensure the types directory exists
const typesDir = path.join(__dirname, '..', 'types');
if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
}

// Create a basic module declaration for Three.js if it doesn't exist
const threeTypesPath = path.join(typesDir, 'three.d.ts');
if (!fs.existsSync(threeTypesPath)) {
    const content = `declare module 'three' {
    export * from 'three/src/Three';
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
}`;

    fs.writeFileSync(threeTypesPath, content);
}

// Create a .npmrc file to ensure proper dependency resolution
const npmrcPath = path.join(__dirname, '..', '.npmrc');
const npmrcContent = `legacy-peer-deps=true
strict-peer-dependencies=false
auto-install-peers=true
node-linker=hoisted`;

fs.writeFileSync(npmrcPath, npmrcContent);

// Update the next-env.d.ts file to include Three.js types
const nextEnvPath = path.join(__dirname, '..', 'next-env.d.ts');
const nextEnvContent = `/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation" />
/// <reference types="three" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.`;

fs.writeFileSync(nextEnvPath, nextEnvContent);

console.log('Three.js setup completed successfully.');
