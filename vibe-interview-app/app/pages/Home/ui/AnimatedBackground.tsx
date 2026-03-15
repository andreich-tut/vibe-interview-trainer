import { useEffect, useRef } from "react";
import * as THREE from "three";

interface FloatingObject {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  radius: number;
  mass: number;
  drift: THREE.Vector2;
  spin: number;
  opacity: number;
  scale: number;
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

// ── Icons ────────────────────────────────────────────────────────────────────

const ICONS = ["⚡", "⚛️", "🔷", "🎨", "🟢", "🧪", "🧠", "🔄", "💻", "🖥️", "🛠️", "📦", "🔌", "🗄️", "🐛", "🚀", "🔐", "📡", "🤖", "⚙️"];

function makeSpriteMat(texture: THREE.CanvasTexture, opacity: number): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const COUNT = 20;
    const initSpecs = Array.from({ length: COUNT }, () => ({
      iconIdx: Math.floor(Math.random() * ICONS.length),
      opacity: 0.35 + Math.random() * 0.50,
      pos: [
        (Math.random() * 2 - 1) * 12,
        (Math.random() * 2 - 1) * 13,
        -(2 + Math.random() * 7),
      ] as [number, number, number],
      scale: 0.65 + Math.random() * 0.50,
      spin: (0.004 + Math.random() * 0.012) * (Math.random() < 0.5 ? 1 : -1),
    }));

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
        mass: scale * (0.8 + Math.random() * 0.6),
        drift: new THREE.Vector2((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.4),
        spin, opacity, scale,
      };
    });

    // ── Mouse tracking ─────────────────────────────────────────
    const mouse = { clientX: -9999, clientY: -9999, active: false };
    const camTarget = { scrollY: 0 };
    const raycaster = new THREE.Raycaster();
    const _mw = new THREE.Vector3();

    function onMouseMove(e: MouseEvent) {
      mouse.clientX = e.clientX;
      mouse.clientY = e.clientY;
      mouse.active = true;
    }
    function onMouseLeave() {
      mouse.active = false;
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

    let rafId: number;
    const _dir = new THREE.Vector3();
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

      // ── Repulsion + spin ──────────────────────────────────────
      for (const obj of objects) {
        obj.mesh.rotation.z += obj.spin;
        if (mouse.active) {
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
      for (const tex of textures) tex.dispose();
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
