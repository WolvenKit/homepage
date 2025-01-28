uniform vec2 uResolution;
uniform vec4 uSourceRect;
uniform vec2 uTargetPos;

attribute vec2 aVertexPosition;

const vec2 OFFSET = vec2(0.5, 0.5);

void main() {
  gl_Position = vec4(((uTargetPos + aVertexPosition * uSourceRect.zw) - OFFSET) / OFFSET, 0.0, 1.0);
}
