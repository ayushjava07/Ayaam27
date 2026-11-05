"use client";

import { useEffect, useRef } from "react";
import styles from "./LiquidSmoke.module.css";

const VERTEX = /* glsl */ `#version 300 es
precision highp float;

void main() {
  // Fullscreen triangle without any vertex buffer.
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2 u_res;
uniform vec2 u_ptr;
uniform float u_time;
uniform float u_hover;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  mat2 r = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = r * p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec2 m = (u_ptr - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  vec2 rel = p - m;
  float d = length(rel);
  float infl = exp(-d * d * 2.0);

  // A slow vortex around the pointer warps the smoke into liquid curls.
  float t = u_time * 0.09;
  float ang = atan(rel.y, rel.x + 1e-5);
  float swirl = infl * (1.15 + 0.45 * sin(u_time * 0.7));
  vec2 sp = m + vec2(cos(ang + swirl), sin(ang + swirl)) * d;

  // Domain-warped fBm: the classic smoke/ink recipe.
  vec2 q = sp * 2.4 + vec2(0.0, -t * 1.6);
  vec2 warp = vec2(
    fbm(q + vec2(0.0, t)),
    fbm(q + vec2(4.7, -t * 0.8))
  );
  float n = fbm(q * 1.7 + warp * 1.5 + vec2(t * 0.6, -t * 0.4));
  n = smoothstep(0.28, 0.92, n);

  float plume = exp(-d * d * (2.3 - 1.1 * n));
  float energy = 0.10 + 0.90 * u_hover;
  float alpha = n * (0.07 + 0.75 * plume * energy);
  alpha += pow(infl, 3.0) * 0.07 * u_hover;
  alpha *= 0.85 + 0.15 * sin(u_time * 0.6 + n * 8.0);
  alpha = clamp(alpha, 0.0, 0.9);

  vec3 silver = vec3(0.682, 0.710, 0.745);
  vec3 white = vec3(0.949, 0.957, 0.969);
  vec3 red = vec3(1.0, 0.165, 0.239);

  vec3 col = mix(silver, white, smoothstep(0.35, 0.95, n));
  col = mix(col, red, 0.22 * smoothstep(0.60, 1.0, n) * infl * u_hover);
  col += white * 0.35 * pow(n, 6.0);
  col += red * 0.22 * pow(infl, 3.0) * u_hover * n;

  outColor = vec4(col, alpha);
}
`;

/**
 * Decorative "liquid smoke" shader for the Coming Soon screens.
 *
 * One full-bleed, non-interactive WebGL 2 canvas. Faint smoke drifts at rest;
 * on hover a domain-warped plume swirls around the pointer with a chrome/red
 * glow. Renders below the page content, pauses when the tab is hidden, and
 * drops to a still frame for `prefers-reduced-motion`. If WebGL 2 is not
 * available the canvas simply hides — the page keeps working.
 */
export function LiquidSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "default",
    });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = vertex && fragment ? gl.createProgram() : null;
    if (!vertex || !fragment || !program) {
      canvas.style.display = "none";
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(program);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uPtr = gl.getUniformLocation(program, "u_ptr");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uHover = gl.getUniformLocation(program, "u_hover");

    gl.bindVertexArray(gl.createVertexArray());

    const section = canvas.parentElement;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reduceQuery.matches;

    const pointer = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    let hover = 0;
    let hoverTarget = 0;
    let time = 0;
    let raf = 0;
    let running = false;
    let last = 0;

    const resize = () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      // The smoke is soft, so a sub-CSS-pixel buffer keeps it cheap.
      const w = Math.max(1, Math.round(rect.width * 0.8));
      const h = Math.max(1, Math.round(rect.height * 0.8));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uPtr, smooth.x, smooth.y);
      gl.uniform1f(uTime, reduced ? 0 : time);
      gl.uniform1f(uHover, hover);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      time += dt;

      smooth.x += (pointer.x - smooth.x) * 0.12;
      smooth.y += (pointer.y - smooth.y) * 0.12;
      hover += (hoverTarget - hover) * 0.08;

      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = 1 - (event.clientY - rect.top) / rect.height;
      hoverTarget = 1;
      if (reduced) {
        smooth.x = pointer.x;
        smooth.y = pointer.y;
        hover = 1;
        draw();
      }
    };

    const onEnter = () => {
      hoverTarget = 1;
      if (reduced) {
        hover = 1;
        draw();
      }
    };

    const onLeave = () => {
      hoverTarget = 0;
      if (reduced) {
        hover = 0;
        draw();
      }
    };

    const onResize = () => {
      resize();
      if (reduced) draw();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onReduceChange = () => {
      reduced = reduceQuery.matches;
      if (reduced) {
        stop();
        time = 0;
        hover = hoverTarget;
        smooth.x = pointer.x;
        smooth.y = pointer.y;
        draw();
      } else {
        start();
      }
    };

    section?.addEventListener("pointermove", onMove);
    section?.addEventListener("pointerenter", onEnter);
    section?.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener?.("change", onReduceChange);

    const observer = section ? new ResizeObserver(onResize) : null;
    if (section) observer?.observe(section);

    resize();
    draw();
    start();

    return () => {
      stop();
      observer?.disconnect();
      section?.removeEventListener("pointermove", onMove);
      section?.removeEventListener("pointerenter", onEnter);
      section?.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener?.("change", onReduceChange);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.smoke} aria-hidden="true" />;
}
