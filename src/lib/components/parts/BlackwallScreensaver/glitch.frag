#ifdef GL_ES
  precision highp float;
#endif

uniform sampler2D uSource;
uniform vec4 uSourceRect;
uniform vec2 uTargetPos;
uniform vec2 uResolution;
uniform vec4 uColorMult;
uniform vec4 uColorAdd;
uniform bool uBlank;

void main(void) {
  vec2 uv = gl_FragCoord.xy / uResolution;

  gl_FragColor = texture2D(uSource, uSourceRect.xy - uTargetPos + uv) * uColorMult + uColorAdd;
}
