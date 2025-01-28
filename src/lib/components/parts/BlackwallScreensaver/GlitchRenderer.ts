import FRAGMENT_SHADER from "./glitch.frag";
import VERTEX_SHADER from "./glitch.vert";

type Size = [w: number, h: number];
type Color = [r: number, g: number, b: number, a?: number];

export interface GlitchRendererOptions {
  cleanChance: number;
  resetChanceMultiplier: number;
  movementRange: number;
  replaceBackgroundChance: number;
  maxRectangleLength: number;
  shapeRatio: number;
  backgroundColor: Color;
}

const DEFAULT_OPTIONS: GlitchRendererOptions = {
  cleanChance: 0.05,
  resetChanceMultiplier: 0,
  movementRange: 0.1,
  replaceBackgroundChance: 0.5,
  maxRectangleLength: 0.1,
  shapeRatio: 0.2,
  backgroundColor: [24, 24, 27],
};

export class GlitchRenderer {
  #size: Size = [0, 0];

  #program: WebGLProgram;
  #texture: WebGLTexture;

  #uResolution: WebGLUniformLocation | null = null;
  #uTargetPos: WebGLUniformLocation | null = null;
  #uSourceRect: WebGLUniformLocation | null = null;
  #uSource: WebGLUniformLocation | null = null;
  #uColorMult: WebGLUniformLocation | null = null;
  #uColorAdd: WebGLUniformLocation | null = null;

  #resetChance = 0;

  public options: GlitchRendererOptions;

  constructor(
    private readonly gl: WebGLRenderingContext,
    options: Partial<GlitchRendererOptions> = {},
  ) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE);

    this.#program = this.#buildShaderProgram(VERTEX_SHADER, FRAGMENT_SHADER);
    this.#initBuffers();

    this.#texture = gl.createTexture();

    gl.useProgram(this.#program);
  }

  setSource(image: TexImageSource) {
    const gl = this.gl;

    this.#setTexture(0, image);
    gl.uniform1i(this.#uSource, 0);
  }

  resize(width: number, height: number) {
    const gl = this.gl;

    this.#size = [width, height];
    gl.viewport(0, 0, width, height);
    gl.uniform2f(this.#uResolution, width, height);
  }

  update() {
    const { gl, options } = this;

    if (Math.random() < this.#resetChance) {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // From
    const tx = Math.random();
    const ty = Math.random();
    const sz = (uvRandom() - 0.5) * 2 * 3; // Subpixel offset
    const width = Math.random() ** 0.5 * options.maxRectangleLength * 2 * (1 - options.shapeRatio);
    const height = Math.random() ** 0.5 * options.maxRectangleLength * 2 * options.shapeRatio;

    // To (relatively to source)
    const sx = tx + uvRandom() * options.movementRange;
    const sy = ty + uvRandom() * options.movementRange;
    const dz = uvRandom() * 3; // Subpixel offset

    gl.uniform2f(this.#uTargetPos, tx, ty);
    gl.uniform4f(this.#uSourceRect, sx, sy, width, height);

    const color = Math.random();
    if (color < 0.4) {
      gl.uniform4f(this.#uColorMult, 1, 1, 1, 1);
    } else if (color < 0.5) {
      gl.uniform4f(this.#uColorMult, 1, 0, 0, 0.75);
    } else if (color < 0.65) {
      gl.uniform4f(this.#uColorMult, 0, 1, 0, 0.75);
    } else if (color < 0.8) {
      gl.uniform4f(this.#uColorMult, 0, 0, 1, 0.75);
    } else {
      gl.uniform4f(this.#uColorMult, 0, 0, 0, 1);
      if (Math.random() < 0.5) {
        gl.uniform4f(this.#uColorAdd, 0, 0, 0, 1);
      }
    }

    this.#resetChance += options.resetChanceMultiplier * ((width * height) / 2);

    // this.i += 0.01;
    // if (this.i >= 1) this.i = 0;
    // gl.uniform1f(this.#uA, this.i);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  #compileShader(code: string, type: GLenum) {
    const gl = this.gl;

    const shader = gl.createShader(type)!;

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error("Error compiling vertex shader: " + gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  #buildShaderProgram(vertexCode: string, fragmentCode: string) {
    const gl = this.gl;

    const vertex = this.#compileShader(vertexCode, gl.VERTEX_SHADER);
    const fragment = this.#compileShader(fragmentCode, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Error linking shader program: " + gl.getProgramInfoLog(program));
    }

    this.#uResolution = gl.getUniformLocation(program, "uResolution");
    this.#uTargetPos = gl.getUniformLocation(program, "uTargetPos");
    this.#uSourceRect = gl.getUniformLocation(program, "uSourceRect");
    this.#uSource = gl.getUniformLocation(program, "uSource");
    this.#uColorMult = gl.getUniformLocation(program, "uColorMult");
    this.#uColorAdd = gl.getUniformLocation(program, "uColorAdd");

    return program;
  }

  #initBuffers() {
    const gl = this.gl;
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vertexPositions = gl.getAttribLocation(this.#program, "aVertexPosition");
    gl.vertexAttribPointer(vertexPositions, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositions);

    return positionBuffer;
  }

  #setTexture(slot: number, texture: TexImageSource) {
    const gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D, this.#texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
}

function uvRandom() {
  return (Math.random() - 0.5) * 2;
}
