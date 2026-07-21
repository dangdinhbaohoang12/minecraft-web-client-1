const { Buffer } = require("buffer");

function createMesher(v, d) { 
    return { optimizeEdges: true, tessellate: (c) => c }; 
}

function processMesh(d) { 
    return d; 
}

module.exports = { createMesher, processMesh };
