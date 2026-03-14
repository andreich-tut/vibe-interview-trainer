import { useEffect, useRef } from "react";
import * as THREE from "three";

interface FloatingObject {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  radius: number;
  mass: number;
  drift: THREE.Vector2;
  spin: number;
  iconIdx: number;
  opacity: number;
  scale: number;
}

// Tiny icon inside hunter belly
interface BellyItem {
  mesh: THREE.Mesh;
  angle: number;   // orbit angle around hunter center
  orbitR: number;  // orbit radius
  spinSpeed: number;
  life: number;    // 1→0, fades out
}

// ── Canvas texture helpers ──────────────────────────────────────────────────

function makeIconTexture(
  drawFn: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 128,
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  const ctx = c.getContext("2d")!;
  drawFn(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function drawEmoji(emoji: string) {
  return makeIconTexture((ctx, size) => {
    ctx.clearRect(0, 0, size, size);
    ctx.font = `${size * 0.72}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, size / 2, size / 2);
  });
}

// ── ASCII Full Face — live canvas redrawn each frame ─────────────────────────
//
//  Full face layout (9 rows):
//    ╭──────────────╮   ← face top
//    │  ~~~   ~~~   │   ← brows
//    │ ╭─╮   ╭─╮   │   ← eye top
//    │ │◉│   │◉│   │   ← eye iris  (pupils drift with time)
//    │ ╰─╯   ╰─╯   │   ← eye bot
//    │     ω        │   ← nose (mouse snout)
//    │   ╰───╯      │   ← mouth
//    │              │   ← cheeks / padding
//    ╰──────────────╯   ← face bottom

export type FaceMood = "normal" | "sleepy" | "angry" | "surprised" | "focused" | "wink";

interface AsciiFaceCanvas {
  texture: THREE.CanvasTexture;
  draw: (t: number, overrideMood?: FaceMood | null) => void;
}

// Per mood: left brow, right brow, left eye iris, right eye iris, mouth
const FACE_MOODS: Record<FaceMood, {
  browL: string; browR: string;
  irisL: string; irisR: string;
  mouth: string;
}> = {
  normal:    { browL: "─",  browR: "─",  irisL: "◉", irisR: "◉", mouth: "╰──╯" },
  sleepy:    { browL: "~",  browR: "~",  irisL: "─", irisR: "─", mouth: "───"  },
  angry:     { browL: "╲",  browR: "╱",  irisL: "▸", irisR: "◂", mouth: "╭──╮" },
  surprised: { browL: "‾",  browR: "‾",  irisL: "●", irisR: "●", mouth: "(──)" },
  focused:   { browL: "─",  browR: "─",  irisL: "◎", irisR: "◎", mouth: "════" },
  wink:      { browL: "^",  browR: "─",  irisL: "^", irisR: "◉", mouth: "╰──╯" },
};

const MOOD_LIST: FaceMood[] = ["normal", "sleepy", "angry", "surprised", "focused", "wink"];
const MOOD_DURATION = 3500;

function makeAsciiEyeCanvas(size = 384): AsciiFaceCanvas {
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  const ctx = c.getContext("2d")!;
  const texture = new THREE.CanvasTexture(c);

  let currentMood: FaceMood = "normal";
  let moodStartTime = 0;
  let moodIndex = 0;

  function draw(now: number, overrideMood?: FaceMood | null) {
    // Mood cycling (only when no external override)
    if (!overrideMood && now - moodStartTime > MOOD_DURATION) {
      moodStartTime = now;
      moodIndex = (moodIndex + 1) % MOOD_LIST.length;
      if (Math.random() < 0.35) moodIndex = Math.floor(Math.random() * MOOD_LIST.length);
      currentMood = MOOD_LIST[moodIndex];
    }

    const mood = FACE_MOODS[overrideMood ?? currentMood];

    // Blink: sleepy blinks often, others rarely
    const blinkL = currentMood === "sleepy"
      ? Math.abs(Math.sin(now * 0.0012)) > 0.80
      : Math.abs(Math.sin(now * 0.00077)) > 0.97;
    // wink: right eye always closed
    const blinkR = currentMood === "wink" || blinkL;

    ctx.clearRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2;

    // ── Soft glow ──────────────────────────────────────────────
    const glow = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.48);
    glow.addColorStop(0, "rgba(100,200,255,0.13)");
    glow.addColorStop(1, "rgba(60,120,255,0.00)");
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.47, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // ── Font & colors ──────────────────────────────────────────
    const lh   = size * 0.112;   // line height
    const fs   = Math.round(size * 0.085); // font size
    ctx.font         = `${fs}px 'Courier New', Courier, monospace`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    const colBrow  = "rgba(180,230,255,0.80)";
    const colEyeB  = "rgba(100,160,220,0.70)";
    const colIris  = "rgba(140,220,255,1.00)";
    const colMouth = "rgba(140,215,255,0.95)";


    // ── Layout ─────────────────────────────────────────────────
    // 5 rows: brows, eyeT, eyeM, eyeB, mouth
    const totalH = lh * 5;
    const y0     = cy - totalH / 2 + lh * 0.5;

    // Eye columns — symmetric around center
    const eyeOff = size * 0.195;

    // ── Row 0: brows ───────────────────────────────────────────
    const browBob = Math.sin(now * 0.0018) * (size * 0.009);
    ctx.fillStyle = colBrow;
    ctx.fillText(mood.browL, cx - eyeOff, y0 + browBob);
    ctx.fillText(mood.browR, cx + eyeOff, y0 + browBob);

    // ── Row 1: eye top lid ─────────────────────────────────────
    ctx.fillStyle = colEyeB;
    ctx.fillText("╭─╮", cx - eyeOff, y0 + lh);
    ctx.fillText("╭─╮", cx + eyeOff, y0 + lh);

    // ── Row 2: iris (with pupil drift) ─────────────────────────
    const drift = Math.sin(now * 0.0013) * (size * 0.018);
    ctx.fillStyle = colEyeB;
    ctx.fillText("│", cx - eyeOff - size * 0.033, y0 + lh * 2);
    ctx.fillStyle = colIris;
    ctx.fillText(blinkL ? "─" : mood.irisL, cx - eyeOff + drift, y0 + lh * 2);
    ctx.fillStyle = colEyeB;
    ctx.fillText("│", cx - eyeOff + size * 0.033, y0 + lh * 2);
    ctx.fillText("│", cx + eyeOff - size * 0.033, y0 + lh * 2);
    ctx.fillStyle = colIris;
    ctx.fillText(blinkR ? "─" : mood.irisR, cx + eyeOff + drift, y0 + lh * 2);
    ctx.fillStyle = colEyeB;
    ctx.fillText("│", cx + eyeOff + size * 0.033, y0 + lh * 2);

    // ── Row 3: eye bottom lid ──────────────────────────────────
    ctx.fillStyle = colEyeB;
    ctx.fillText(blinkL ? "───" : "╰─╯", cx - eyeOff, y0 + lh * 3);
    ctx.fillText(blinkR ? "───" : "╰─╯", cx + eyeOff, y0 + lh * 3);

    // ── Row 4: mouth ───────────────────────────────────────────
    const mouthWobble = Math.sin(now * 0.0021) * (size * 0.006);
    ctx.fillStyle = colMouth;
    ctx.fillText(mood.mouth, cx + mouthWobble, y0 + lh * 4);

    texture.needsUpdate = true;
  }

  draw(0);
  return { texture, draw };
}

// ── Icons ────────────────────────────────────────────────────────────────────

const ICONS = ["⚡", "⚛️", "🔷", "🎨", "🟢", "🧪", "🧠", "🔄"];

function makeSpriteMat(texture: THREE.CanvasTexture, opacity: number): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

// ── Hunter ───────────────────────────────────────────────────────────────────

interface Hunter {
  mesh: THREE.Mesh;
  eye: AsciiFaceCanvas;
  worldPos: THREE.Vector3;
  facingAngle: number;
}

function buildHunterMesh(): Hunter {
  const eye = makeAsciiEyeCanvas(320);
  const mat = new THREE.MeshBasicMaterial({
    map: eye.texture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), mat);
  mesh.visible = false;
  return { mesh, eye, worldPos: new THREE.Vector3(), facingAngle: 0 };
}

// ── Component ────────────────────────────────────────────────────────────────

// Eat burst: icon scales up then flies toward hunter, fading out
interface EatParticle {
  mesh: THREE.Mesh;
  targetX: number;
  targetY: number;
  life: number;   // 1 → 0
  phase: "burst" | "fly";
  burstScale: number;
}

interface AnimatedBackgroundProps {
  onEat?: (iconIdx: number) => void;
  moodOverride?: FaceMood | null;
  speedTier?: number;  // 0–4, multiplies icon velocity
  dying?: boolean;     // triggers canvas glitch effect
}

export function AnimatedBackground({ onEat, moodOverride, speedTier = 0, dying = false }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onEatRef = useRef(onEat);
  const moodOverrideRef = useRef(moodOverride);
  const speedTierRef = useRef(speedTier);
  const dyingRef = useRef(dying);
  useEffect(() => { onEatRef.current = onEat; }, [onEat]);
  useEffect(() => { moodOverrideRef.current = moodOverride; }, [moodOverride]);
  useEffect(() => { speedTierRef.current = speedTier; }, [speedTier]);
  useEffect(() => { dyingRef.current = dying; }, [dying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 200);
    camera.position.z = 14;

    function resize() {
      const w = canvas!.clientWidth, h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function visibleHalfExtents(worldZ: number) {
      const dist = camera.position.z - worldZ;
      const hh = Math.tan((camera.fov * Math.PI) / 360) * dist;
      return { hw: hh * camera.aspect, hh };
    }

    // ── Textures ──────────────────────────────────────────────
    const textures = ICONS.map(drawEmoji);
    const COLL_RADIUS_BASE = 1.0;

    // ── Eat particles (burst + fly animation on eat) ───────────
    const eatParticles: EatParticle[] = [];

    function spawnEatParticle(iconIdx: number, fromX: number, fromY: number, fromZ: number, toX: number, toY: number) {
      const tex = textures[iconIdx % textures.length];
      const mat = makeSpriteMat(tex, 0.9);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), mat);
      const baseScale = 0.7 + Math.random() * 0.3;
      mesh.scale.setScalar(baseScale);
      mesh.position.set(fromX, fromY, fromZ + 0.5);
      scene.add(mesh);
      eatParticles.push({ mesh, targetX: toX, targetY: toY, life: 1.0, phase: "burst", burstScale: baseScale });
    }

    // ── Belly items (eaten icons orbiting inside hunter) ───────
    const belly: BellyItem[] = [];
    const MAX_BELLY = 6;
    const BELLY_FADE_SPEED = 0.0018; // life decrease per frame

    function addToBelly(iconIdx: number) {
      const tex = textures[iconIdx % textures.length];
      const mat = makeSpriteMat(tex, 0.75);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), mat);
      mesh.scale.setScalar(0.28);
      mesh.position.z = 1.1; // slightly in front of hunter
      scene.add(mesh);

      belly.push({
        mesh,
        angle: Math.random() * Math.PI * 2,
        orbitR: 0.25 + Math.random() * 0.3,
        spinSpeed: (Math.random() - 0.5) * 0.08,
        life: 1.0,
      });

      // Keep belly from growing too large
      if (belly.length > MAX_BELLY) {
        const old = belly.shift()!;
        scene.remove(old.mesh);
        old.mesh.geometry.dispose();
        (old.mesh.material as THREE.MeshBasicMaterial).dispose();
      }
    }

    // ── Spawn one object at a random screen edge ──────────────
    function spawnFromEdge(iconIdx: number, opacity: number, scale: number): FloatingObject {
      const { hw, hh } = visibleHalfExtents(-4);
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      const speedMult = 1 + speedTierRef.current * 0.35;
      const inward = (0.08 + Math.random() * 0.06) * speedMult;
      if (side === 0) { x = (Math.random() * 2 - 1) * hw; y =  hh + 1; }
      if (side === 1) { x = (Math.random() * 2 - 1) * hw; y = -hh - 1; }
      if (side === 2) { x = -hw - 1; y = (Math.random() * 2 - 1) * hh; }
      if (side === 3) { x =  hw + 1; y = (Math.random() * 2 - 1) * hh; }

      const tex = textures[iconIdx % textures.length];
      const mat = makeSpriteMat(tex, opacity);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), mat);
      mesh.position.set(x, y, -4);
      mesh.scale.setScalar(scale);
      scene.add(mesh);

      const angle = Math.atan2(-y, -x) + (Math.random() - 0.5) * 0.8;
      return {
        mesh,
        vel: new THREE.Vector3(Math.cos(angle) * inward, Math.sin(angle) * inward, 0),
        radius: COLL_RADIUS_BASE * scale,
        mass: 0.6 + Math.random() * 0.8,
        drift: new THREE.Vector2((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.4),
        spin: (Math.random() - 0.5) * 0.02,
        iconIdx,
        opacity,
        scale,
      };
    }

    type InitSpec = { iconIdx: number; opacity: number; pos: [number, number, number]; scale: number; spin: number };
    const initSpecs: InitSpec[] = [
      { iconIdx: 0, opacity: 0.80, pos: [-9,  12, -3], scale: 1.10, spin:  0.008 },
      { iconIdx: 1, opacity: 0.70, pos: [ 9,   8, -2], scale: 0.95, spin: -0.006 },
      { iconIdx: 2, opacity: 0.75, pos: [ 5,  -2, -5], scale: 1.00, spin:  0.010 },
      { iconIdx: 3, opacity: 0.65, pos: [-8,  -8, -4], scale: 0.88, spin: -0.007 },
      { iconIdx: 4, opacity: 0.50, pos: [10, -12, -5], scale: 0.80, spin:  0.005 },
      { iconIdx: 5, opacity: 0.72, pos: [11,   3, -4], scale: 0.92, spin: -0.009 },
      { iconIdx: 6, opacity: 0.68, pos: [-11, -3, -3], scale: 0.88, spin:  0.006 },
      { iconIdx: 7, opacity: 0.45, pos: [-5, -13, -7], scale: 0.75, spin: -0.004 },
      { iconIdx: 0, opacity: 0.40, pos: [ 8,  -7, -8], scale: 0.72, spin:  0.007 },
      { iconIdx: 1, opacity: 0.78, pos: [-3,  10, -5], scale: 0.96, spin: -0.011 },
      { iconIdx: 2, opacity: 0.55, pos: [ 9,  -9, -6], scale: 0.70, spin:  0.008 },
      { iconIdx: 3, opacity: 0.42, pos: [-10,  1, -8], scale: 0.65, spin: -0.005 },
      { iconIdx: 4, opacity: 0.78, pos: [ 2,   5, -3], scale: 0.98, spin:  0.012 },
      { iconIdx: 5, opacity: 0.68, pos: [-7,  11, -2], scale: 0.88, spin: -0.007 },
      { iconIdx: 6, opacity: 0.45, pos: [ 6,  -4, -9], scale: 0.72, spin:  0.006 },
      { iconIdx: 7, opacity: 0.70, pos: [-4, -10, -5], scale: 0.88, spin: -0.009 },
      { iconIdx: 0, opacity: 0.82, pos: [ 3,   1, -2], scale: 1.08, spin:  0.011 },
      { iconIdx: 1, opacity: 0.44, pos: [-4,   7, -4], scale: 0.68, spin: -0.016 },
      { iconIdx: 6, opacity: 0.72, pos: [ 1, -11, -9], scale: 0.90, spin:  0.005 },
      { iconIdx: 7, opacity: 0.75, pos: [11,  12, -4], scale: 0.96, spin: -0.010 },
    ];

    const objects: FloatingObject[] = initSpecs.map(({ iconIdx, opacity, pos, scale, spin }) => {
      const tex = textures[iconIdx % textures.length];
      const mat = makeSpriteMat(tex, opacity);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), mat);
      mesh.position.set(...pos);
      mesh.scale.setScalar(scale);
      scene.add(mesh);
      const speed = 0.03 + Math.random() * 0.04;
      const angle = Math.random() * Math.PI * 2;
      return {
        mesh,
        vel: new THREE.Vector3(Math.cos(angle) * speed, Math.sin(angle) * speed, 0),
        radius: COLL_RADIUS_BASE * scale,
        mass: 0.6 + Math.random() * 0.8,
        drift: new THREE.Vector2((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.4),
        spin, iconIdx, opacity, scale,
      };
    });

    // ── Hunter ─────────────────────────────────────────────────
    const hunter = buildHunterMesh();
    hunter.mesh.position.set(0, 0, 1);
    scene.add(hunter.mesh);

    // ── Mouse tracking ─────────────────────────────────────────
    const mouse = { clientX: -9999, clientY: -9999, active: false, moved: false };
    const camTarget = { scrollY: 0 };
    const raycaster    = new THREE.Raycaster();
    const mouseWorld   = new THREE.Vector3();
    const prevMouseWorld = new THREE.Vector3();
    const mouseDelta   = new THREE.Vector2();

    function onMouseMove(e: MouseEvent) {
      mouse.clientX = e.clientX;
      mouse.clientY = e.clientY;
      if (!mouse.active) mouse.moved = false;
      mouse.active = true;
      hunter.mesh.visible = true;
    }
    function onMouseLeave() {
      mouse.active = false;
      mouse.moved  = false;
      hunter.mesh.visible = false;
    }
    function onScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      camTarget.scrollY = max > 0 ? -(window.scrollY / max) * 14 : 0;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ── Constants ──────────────────────────────────────────────
    const REPULSE_RADIUS     = 5.0;
    const REPULSE_STRENGTH   = 0.18;
    const DAMPING            = 0.998;
    const MAX_SPEED          = 0.45;
    const BORDER_OVERSHOOT   = 0.02;
    const BOUNCE_RESTITUTION = 1.0;
    const OBJECT_RESTITUTION = 0.80;
    const EAT_RADIUS         = 1.5;
    // Hunter trails cursor by this offset opposite to facing direction
    const TRAIL_OFFSET       = 1.1;

    let rafId: number;
    const _dir = new THREE.Vector3();
    const _mw  = new THREE.Vector3();
    const _sep = new THREE.Vector3();
    const projPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    function animate() {
      rafId = requestAnimationFrame(animate);

      camera.position.x = 0;
      camera.position.y = camTarget.scrollY;
      camera.lookAt(0, camTarget.scrollY, 0);

      const ndcX = (mouse.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(mouse.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      raycaster.ray.intersectPlane(
        new THREE.Plane(new THREE.Vector3(0, 0, 1), -1),
        mouseWorld,
      );

      // ── Hunter: trails behind cursor in movement direction ────
      if (mouse.active) {
        if (!mouse.moved) {
          hunter.worldPos.copy(mouseWorld);
          prevMouseWorld.copy(mouseWorld);
          mouse.moved = true;
        } else {
          mouseDelta.set(
            mouseWorld.x - prevMouseWorld.x,
            mouseWorld.y - prevMouseWorld.y,
          );
          hunter.worldPos.lerp(mouseWorld, 0.18);
        }
        prevMouseWorld.copy(mouseWorld);

        // Offset hunter behind the cursor (opposite to facing = trailing)
        const trailX = -Math.cos(hunter.facingAngle) * TRAIL_OFFSET;
        const trailY = -Math.sin(hunter.facingAngle) * TRAIL_OFFSET;
        hunter.mesh.position.x = hunter.worldPos.x + trailX;
        hunter.mesh.position.y = hunter.worldPos.y + trailY;
      }

      // ── Facing: follow mouse movement direction ───────────────
      if (mouseDelta.lengthSq() > 0.000001) {
        const targetAngle = Math.atan2(mouseDelta.y, mouseDelta.x);
        const diff = ((targetAngle - hunter.facingAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        hunter.facingAngle += diff * 0.18;
        // Eye stays upright — no rotation applied
      }

      // ── Eye: update ASCII eye animation ───────────────────────
      hunter.eye.draw(performance.now(), moodOverrideRef.current);

      // ── Belly: orbit tiny eaten icons around hunter ───────────
      for (let i = belly.length - 1; i >= 0; i--) {
        const b = belly[i];
        b.life -= BELLY_FADE_SPEED;
        if (b.life <= 0) {
          scene.remove(b.mesh);
          b.mesh.geometry.dispose();
          (b.mesh.material as THREE.MeshBasicMaterial).dispose();
          belly.splice(i, 1);
          continue;
        }
        b.angle += b.spinSpeed;
        b.mesh.position.x = hunter.mesh.position.x + Math.cos(b.angle) * b.orbitR;
        b.mesh.position.y = hunter.mesh.position.y + Math.sin(b.angle) * b.orbitR;
        b.mesh.rotation.z += 0.05;
        const mat = b.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = b.life * 0.75;
      }

      // ── Eat icons ─────────────────────────────────────────────
      for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        const dx = obj.mesh.position.x - hunter.mesh.position.x;
        const dy = obj.mesh.position.y - hunter.mesh.position.y;
        if (Math.sqrt(dx * dx + dy * dy) < EAT_RADIUS && mouse.active) {
          // Spawn burst particle before removing
          spawnEatParticle(
            obj.iconIdx,
            obj.mesh.position.x, obj.mesh.position.y, obj.mesh.position.z,
            hunter.mesh.position.x, hunter.mesh.position.y,
          );
          scene.remove(obj.mesh);
          obj.mesh.geometry.dispose();
          (obj.mesh.material as THREE.MeshBasicMaterial).dispose();
          addToBelly(obj.iconIdx);
          onEatRef.current?.(obj.iconIdx);
          const { opacity, scale } = obj;
          objects.splice(i, 1);
          setTimeout(() => {
            objects.push(spawnFromEdge(
              Math.floor(Math.random() * ICONS.length),
              opacity,
              scale,
            ));
          }, 800 + Math.random() * 600);
        }
      }

      // ── Eat particles: burst → fly → fade ─────────────────────
      for (let i = eatParticles.length - 1; i >= 0; i--) {
        const p = eatParticles[i];
        p.life -= 0.045;
        if (p.life <= 0) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.MeshBasicMaterial).dispose();
          eatParticles.splice(i, 1);
          continue;
        }
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        if (p.phase === "burst") {
          // Scale up quickly then switch to fly
          const t = 1 - p.life;
          p.mesh.scale.setScalar(p.burstScale * (1 + t * 2.5));
          mat.opacity = p.life;
          if (p.life < 0.65) p.phase = "fly";
        } else {
          // Fly toward hunter
          p.mesh.position.x += (p.targetX - p.mesh.position.x) * 0.22;
          p.mesh.position.y += (p.targetY - p.mesh.position.y) * 0.22;
          p.mesh.scale.setScalar(p.burstScale * p.life * 0.8);
          p.mesh.rotation.z += 0.12;
          mat.opacity = p.life * 0.8;
        }
      }

      // ── Repulsion + spin ──────────────────────────────────────
      for (const obj of objects) {
        obj.mesh.rotation.z += obj.spin;
        projPlane.constant = obj.mesh.position.z;
        raycaster.ray.intersectPlane(projPlane, _mw);
        _dir.set(obj.mesh.position.x - _mw.x, obj.mesh.position.y - _mw.y, 0);
        const dist2d = _dir.length();
        if (dist2d < REPULSE_RADIUS && dist2d > 0.01) {
          _dir.normalize();
          _dir.x += obj.drift.x; _dir.y += obj.drift.y;
          _dir.normalize();
          const falloff = (1 - dist2d / REPULSE_RADIUS) ** 2;
          const impulse = (REPULSE_STRENGTH / obj.mass) * falloff;
          obj.vel.x += _dir.x * impulse;
          obj.vel.y += _dir.y * impulse;
        }
      }

      // ── Object–object collision ───────────────────────────────
      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          const a = objects[i], b = objects[j];
          if (Math.abs(a.mesh.position.z - b.mesh.position.z) > 3) continue;
          _sep.set(b.mesh.position.x - a.mesh.position.x, b.mesh.position.y - a.mesh.position.y, 0);
          const dist = _sep.length();
          const minDist = a.radius + b.radius;
          if (dist < minDist && dist > 0.001) {
            const overlap = (minDist - dist) / 2;
            _sep.normalize();
            a.mesh.position.x -= _sep.x * overlap; a.mesh.position.y -= _sep.y * overlap;
            b.mesh.position.x += _sep.x * overlap; b.mesh.position.y += _sep.y * overlap;
            const vRel = (a.vel.x - b.vel.x) * _sep.x + (a.vel.y - b.vel.y) * _sep.y;
            if (vRel > 0) continue;
            const mA = a.mass, mB = b.mass;
            const j2 = -(1 + OBJECT_RESTITUTION) * vRel / (1 / mA + 1 / mB);
            a.vel.x += (j2 / mA) * _sep.x; a.vel.y += (j2 / mA) * _sep.y;
            b.vel.x -= (j2 / mB) * _sep.x; b.vel.y -= (j2 / mB) * _sep.y;
          }
        }
      }

      // ── Border bounce + integrate ─────────────────────────────
      for (const obj of objects) {
        const { hw, hh } = visibleHalfExtents(obj.mesh.position.z);
        const bx = hw * (1 + BORDER_OVERSHOOT);
        const by = hh * (1 + BORDER_OVERSHOOT);
        const spd = obj.vel.length();
        if (spd > MAX_SPEED) obj.vel.multiplyScalar(MAX_SPEED / spd);
        obj.vel.multiplyScalar(DAMPING);
        obj.mesh.position.x += obj.vel.x;
        obj.mesh.position.y += obj.vel.y;
        if (obj.mesh.position.x < -bx) { obj.mesh.position.x = -bx; obj.vel.x =  Math.abs(obj.vel.x) * BOUNCE_RESTITUTION; }
        else if (obj.mesh.position.x > bx) { obj.mesh.position.x =  bx; obj.vel.x = -Math.abs(obj.vel.x) * BOUNCE_RESTITUTION; }
        if (obj.mesh.position.y < -by + camTarget.scrollY) { obj.mesh.position.y = -by + camTarget.scrollY; obj.vel.y =  Math.abs(obj.vel.y) * BOUNCE_RESTITUTION; }
        else if (obj.mesh.position.y > by + camTarget.scrollY) { obj.mesh.position.y =  by + camTarget.scrollY; obj.vel.y = -Math.abs(obj.vel.y) * BOUNCE_RESTITUTION; }
      }

      // ── Dying glitch: shake camera + invert tint ──────────────
      if (dyingRef.current) {
        const t = performance.now();
        const shakeX = (Math.random() - 0.5) * 0.4 * Math.sin(t * 0.07);
        const shakeY = (Math.random() - 0.5) * 0.25 * Math.cos(t * 0.09);
        camera.position.x = shakeX;
        camera.position.y = camTarget.scrollY + shakeY;
        renderer.setClearColor(0x200010, Math.random() * 0.12);
      } else {
        renderer.setClearColor(0x000000, 0);
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      for (const obj of objects) {
        obj.mesh.geometry.dispose();
        (obj.mesh.material as THREE.MeshBasicMaterial).map?.dispose();
        (obj.mesh.material as THREE.MeshBasicMaterial).dispose();
        scene.remove(obj.mesh);
      }
      for (const b of belly) {
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.MeshBasicMaterial).dispose();
        scene.remove(b.mesh);
      }
      for (const p of eatParticles) {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.MeshBasicMaterial).dispose();
        scene.remove(p.mesh);
      }
      for (const tex of textures) tex.dispose();
      scene.remove(hunter.mesh);
      hunter.mesh.geometry.dispose();
      hunter.eye.texture.dispose();
      (hunter.mesh.material as THREE.MeshBasicMaterial).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
