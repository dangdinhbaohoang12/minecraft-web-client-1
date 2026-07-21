import { Buffer } from "buffer";
export function createMesher(v, d) { return { optimizeEdges: true, tessellate: (c) => c }; }
export function processMesh(d) { return d; }