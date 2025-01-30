export default class SimplexNoise {
    private grad3: number[][];
    private p: number[];
    private perm: number[];

    constructor(r: { random: () => number } = Math) {
        this.grad3 = [
            [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
        ];
        this.p = [];
        for (let i = 0; i < 256; i++) {
            this.p[i] = Math.floor(r.random() * 256);
        }
        
        this.perm = [];
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }

    private dot(g: number[], x: number, y: number, z: number): number {
        return g[0] * x + g[1] * y + g[2] * z;
    }

    public noise(xin: number, yin: number, zin: number): number {
        let n0: number, n1: number, n2: number, n3: number;
        
        const F3 = 1.0 / 3.0;
        const G3 = 1.0 / 6.0;
        
        const s = (xin + yin + zin) * F3;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const k = Math.floor(zin + s);
        
        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        
        const x0 = xin - X0;
        const y0 = yin - Y0;
        const z0 = zin - Z0;
        
        let i1: number, j1: number, k1: number;
        let i2: number, j2: number, k2: number;
        
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0;
                i2 = 1; j2 = 1; k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0;
                i2 = 1; j2 = 0; k2 = 1;
            } else {
                i1 = 0; j1 = 0; k1 = 1;
                i2 = 1; j2 = 0; k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0; j1 = 0; k1 = 1;
                i2 = 0; j2 = 1; k2 = 1;
            } else if (x0 < z0) {
                i1 = 0; j1 = 1; k1 = 0;
                i2 = 0; j2 = 1; k2 = 1;
            } else {
                i1 = 0; j1 = 1; k1 = 0;
                i2 = 1; j2 = 1; k2 = 0;
            }
        }
        
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2.0 * G3;
        const y2 = y0 - j2 + 2.0 * G3;
        const z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3;
        const y3 = y0 - 1.0 + 3.0 * G3;
        const z3 = z0 - 1.0 + 3.0 * G3;
        
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        
        const t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            const gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
        }
        
        const t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            const gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
        }
        
        const t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            const gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
        }
        
        const t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            const gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
            n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
        }
        
        return 32.0 * (n0 + n1 + n2 + n3);
    }
}
