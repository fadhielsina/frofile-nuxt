<script setup lang="ts">
/**
 * "Swarm rebuild" effect: a cloud of particles flies in from random positions
 * and assembles itself into `text`. The pointer scatters the swarm, a click
 * (or the periodic timer) blows it apart, and it always rebuilds afterwards.
 * Purely decorative (aria-hidden) — real text for SEO lives elsewhere.
 */
const props = withDefaults(
  defineProps<{
    text: string
    /** seconds between automatic scatter + rebuild cycles (0 = off) */
    cycle?: number
  }>(),
  { cycle: 9 }
)

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  c: number
  size: number
}

const COLORS = ['#60a5fa', '#3b82f6', '#93c5fd', '#2563eb', '#bfdbfe']

const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let w = 0
let h = 0
let dpr = 1
let raf = 0
let running = false
let freeUntil = 0 // while now < freeUntil the swarm is "exploded" (weak spring)
let lastCycle = 0
const pointer = { x: -9999, y: -9999, active: false }
let reduceMotion = false
let resizeObs: ResizeObserver | null = null
let io: IntersectionObserver | null = null

function buildTargets() {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const octx = off.getContext('2d', { willReadFrequently: true })!
  const fontSize = Math.min(h * 0.62, (w / Math.max(props.text.length, 1)) * 1.55)
  octx.fillStyle = '#fff'
  octx.font = `800 ${fontSize}px ui-sans-serif, system-ui, 'Segoe UI', Arial, sans-serif`
  octx.textAlign = 'center'
  octx.textBaseline = 'middle'
  octx.fillText(props.text, w / 2, h / 2)

  const gap = w < 640 ? 5 : 4
  const data = octx.getImageData(0, 0, w, h).data
  const pts: [number, number][] = []
  for (let y = 0; y < h; y += gap) {
    for (let x = 0; x < w; x += gap) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push([x, y])
    }
  }
  return pts
}

function build() {
  const pts = buildTargets()
  const next: Particle[] = pts.map(([tx, ty], i) => {
    const old = particles[i]
    return {
      // reuse previous positions on resize so the swarm doesn't "teleport"
      x: old ? old.x : Math.random() * w,
      y: old ? old.y : Math.random() * h,
      vx: 0,
      vy: 0,
      tx,
      ty,
      c: Math.floor(Math.random() * COLORS.length),
      size: Math.random() * 1.2 + 1.4
    }
  })
  particles = next
}

function burst(strength = 14) {
  freeUntil = performance.now() + 1100
  for (const p of particles) {
    const a = Math.random() * Math.PI * 2
    const s = (Math.random() * 0.7 + 0.3) * strength
    p.vx += Math.cos(a) * s
    p.vy += Math.sin(a) * s
  }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  for (let c = 0; c < COLORS.length; c++) {
    ctx.fillStyle = COLORS[c]
    ctx.beginPath()
    for (const p of particles) {
      if (p.c !== c) continue
      ctx.rect(p.x, p.y, p.size, p.size)
    }
    ctx.fill()
  }
}

function step(now: number) {
  const free = now < freeUntil
  const spring = free ? 0.002 : 0.045
  const damping = free ? 0.985 : 0.86

  if (props.cycle > 0 && now - lastCycle > props.cycle * 1000) {
    lastCycle = now
    burst(11)
  }

  for (const p of particles) {
    p.vx += (p.tx - p.x) * spring
    p.vy += (p.ty - p.y) * spring

    if (pointer.active) {
      const dx = p.x - pointer.x
      const dy = p.y - pointer.y
      const d2 = dx * dx + dy * dy
      if (d2 < 110 * 110) {
        const d = Math.sqrt(d2) || 1
        const f = (1 - d / 110) * 5.5
        p.vx += (dx / d) * f
        p.vy += (dy / d) * f
      }
    }

    p.vx *= damping
    p.vy *= damping
    p.x += p.vx
    p.y += p.vy
  }
  draw()
}

function loop(now: number) {
  if (!running) return
  step(now)
  raf = requestAnimationFrame(loop)
}

function start() {
  if (running || reduceMotion) return
  running = true
  lastCycle = performance.now()
  raf = requestAnimationFrame(loop)
}

function stop() {
  running = false
  cancelAnimationFrame(raf)
}

function resize() {
  const el = canvas.value
  if (!el || !el.parentElement) return
  const rect = el.parentElement.getBoundingClientRect()
  w = Math.max(1, Math.floor(rect.width))
  h = Math.max(1, Math.floor(rect.height))
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = w * dpr
  el.height = h * dpr
  el.style.width = `${w}px`
  el.style.height = `${h}px`
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  build()
  if (reduceMotion) {
    for (const p of particles) {
      p.x = p.tx
      p.y = p.ty
    }
    draw()
  }
}

function onMove(e: PointerEvent) {
  const el = canvas.value
  if (!el) return
  const r = el.getBoundingClientRect()
  pointer.x = e.clientX - r.left
  pointer.y = e.clientY - r.top
  pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height
}

function onDown(e: PointerEvent) {
  onMove(e)
  if (pointer.active) burst(16)
}

function onLeave() {
  pointer.active = false
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()

  resizeObs = new ResizeObserver(() => resize())
  if (canvas.value?.parentElement) resizeObs.observe(canvas.value.parentElement)

  // only animate while on screen
  io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()), { threshold: 0 })
  if (canvas.value) io.observe(canvas.value)

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  document.addEventListener('mouseleave', onLeave)
})

onBeforeUnmount(() => {
  stop()
  resizeObs?.disconnect()
  io?.disconnect()
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onDown)
  document.removeEventListener('mouseleave', onLeave)
})

watch(() => props.text, () => canvas.value && resize())
</script>

<template>
  <div class="pointer-events-none absolute inset-0" aria-hidden="true">
    <canvas ref="canvas" class="block" />
  </div>
</template>
