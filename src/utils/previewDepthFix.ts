// Utilities to ensure placement preview renders with proper depth state
// Supports THREE.js materials/meshes and a raw WebGL render wrapper.

export function configureThreePreviewMaterial(material: any) {
  // Ensure the preview is occluded by terrain (depthTest on),
  // but usually keep depthWrite false for translucency so it doesn't pollute the depth buffer.
  material.depthTest = true
  material.depthWrite = false
  // Transparent so opacity works; set to false if you want fully opaque preview.
  material.transparent = true
}

/**
 * Ensure the preview mesh draws after opaque geometry if needed,
 * without breaking depth testing. High renderOrder avoids accidental reordering.
 */
export function configurePreviewMesh(mesh: any) {
  mesh.renderOrder = 999
}

/**
 * Wrapper for raw WebGL preview rendering that saves and restores GL state.
 * Use this if your project uses raw WebGL calls rather than three.js.
 *
 * Example usage:
 *   withWebGLPreview(gl, () => {
 *     // draw preview geometry here
 *   });
 */
export function withWebGLPreview(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  renderPreview: () => void,
) {
  // Save relevant state
  const depthTestWasEnabled = gl.isEnabled(gl.DEPTH_TEST)
  const depthMaskWas = gl.getParameter(gl.DEPTH_WRITEMASK) as boolean
  const blendWasEnabled = gl.isEnabled(gl.BLEND)

  try {
    // Ensure depth testing so the preview is occluded by terrain.
    gl.enable(gl.DEPTH_TEST)
    // Typical translucent preview: do not write to depth buffer so transparent preview doesn't block other draws.
    gl.depthMask(false)

    // If the preview needs blending for translucency, enable it; otherwise disable.
    // Uncomment below if you want to ensure blending:
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Actual preview rendering:
    renderPreview()
  } finally {
    // Restore state
    if (!depthTestWasEnabled) gl.disable(gl.DEPTH_TEST)
    gl.depthMask(depthMaskWas)
    if (blendWasEnabled) gl.enable(gl.BLEND)
    else gl.disable(gl.BLEND)
  }
}
