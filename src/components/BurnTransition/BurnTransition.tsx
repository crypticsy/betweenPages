// ─── Burn Transition ──────────────────────────────────────────────────────────
// WebGL burn effect. Fire spreads bottom-up; burned areas reveal the target
// page color. When fully consumed, the screen is already at the game color so
// the overlay can vanish instantly — no visible cut.

import { useEffect, useRef } from 'react';

// ── Shaders ──────────────────────────────────────────────────────────────────

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;
  uniform vec2  u_res;
  uniform float u_progress;
  uniform float u_time;
  uniform vec3  u_burnColor;   // destination page background color
  uniform vec3  u_fireInner;   // fire core color (deep, hot side)
  uniform vec3  u_fireOuter;   // fire tip color (bright, outer edge)

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                    hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)),   hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;

    // Layered organic noise
    float n1 = fbm(uv * 3.5 + vec2( u_time * 0.15,  u_time * 0.08));
    float n2 = fbm(uv * 7.0 - vec2( u_time * 0.07,  u_time * 0.13));
    float n3 = fbm(uv * 14.0 + vec2(u_time * 0.05, -u_time * 0.04));
    float combined = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;

    // Bias outward from center: center burns first, edges last
    float dist = length(uv - vec2(0.5));   // 0 at center, ~0.707 at corners
    combined += (dist / 0.707) * 0.42;
    combined  = clamp(combined, 0.0, 1.0);

    // Sweep threshold 0 → 1
    float thr   = u_progress * 1.45 - 0.22;
    float edgeW = 0.065;

    if (combined < thr - edgeW) {
      // Fully burned → destination page color
      gl_FragColor = vec4(u_burnColor, 1.0);

    } else if (combined < thr) {
      // Burning edge → fire gradient fading into the page color
      float t    = (combined - (thr - edgeW)) / edgeW; // 0 = inner, 1 = outer
      vec3 fire  = mix(u_fireInner, u_fireOuter, t);
      // Outer tip of fire blends into the destination color
      vec3 col   = mix(fire, u_burnColor, pow(t, 3.0));
      float flicker = fbm(uv * 18.0 + u_time * 0.6) * 0.25 + 0.82;
      col *= flicker;
      gl_FragColor = vec4(col, 1.0);

    } else {
      // Not yet burned — transparent (title screen shows through)
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
  }
`;

// ── Timing (ms) ──────────────────────────────────────────────────────────────

const BURN_MS = 1150;  // title burns away
const HOLD_MS = 80;    // brief hold at destination color (screen swaps here)

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse a CSS hex color (#rrggbb) into a normalised [r, g, b] triple. */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  active: boolean;
  /** CSS hex color of the destination screen's page background */
  burnColor: string;
  /** CSS hex color for the hot core of the fire (default: deep orange-red) */
  fireInner?: string;
  /** CSS hex color for the bright tip of the fire (default: yellow-white) */
  fireOuter?: string;
  /** Called when screen is fully covered — swap the underlying screen here */
  onMidpoint: () => void;
  /** Called when transition is complete */
  onComplete: () => void;
}

export default function BurnTransition({
  active,
  burnColor,
  fireInner = '#EB1F00',
  fireOuter = '#FFE114',
  onMidpoint,
  onComplete,
}: Props) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const onMidpointRef = useRef(onMidpoint);
  const onCompleteRef = useRef(onComplete);
  const rafRef        = useRef<number>(0);

  onMidpointRef.current = onMidpoint;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      onMidpointRef.current();
      onCompleteRef.current();
      return;
    }

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
       1, -1,  1,  1, -1,  1,
    ]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uRes       = gl.getUniformLocation(prog, 'u_res');
    const uProgress  = gl.getUniformLocation(prog, 'u_progress');
    const uTime      = gl.getUniformLocation(prog, 'u_time');
    const uBurnColor = gl.getUniformLocation(prog, 'u_burnColor');
    const uFireInner = gl.getUniformLocation(prog, 'u_fireInner');
    const uFireOuter = gl.getUniformLocation(prog, 'u_fireOuter');

    gl.uniform3f(uBurnColor, ...hexToRgb(burnColor));
    gl.uniform3f(uFireInner, ...hexToRgb(fireInner));
    gl.uniform3f(uFireOuter, ...hexToRgb(fireOuter));

    const total  = BURN_MS + HOLD_MS;
    const start  = performance.now();
    let midFired = false;

    canvas.style.opacity = '1';

    const tick = (now: number) => {
      const elapsed = now - start;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed * 0.001);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (elapsed < BURN_MS) {
        // Phase 1 — burn in
        gl.uniform1f(uProgress, elapsed / BURN_MS);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

      } else if (elapsed < total) {
        // Phase 2 — hold at destination color, fire midpoint
        gl.uniform1f(uProgress, 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!midFired) {
          midFired = true;
          onMidpointRef.current();
        }

      } else {
        // Done — canvas is destination color == game screen color, safe to remove
        canvas.style.opacity = '0';
        onCompleteRef.current();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active, burnColor, fireInner, fireOuter]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
