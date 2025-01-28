#ifdef GL_ES
  precision highp float;
#endif

uniform sampler2D uSource;
uniform vec4 uSourceRect;
uniform vec2 uTargetPos;
uniform vec2 uResolution;
uniform vec4 uColorMult;
uniform vec4 uColorAdd;

void main(void) {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec4 color = texture2D(uSource, uSourceRect.xy - uTargetPos + uv);

  gl_FragColor = color * uColorMult + uColorAdd;
}
