import { useEffect, useRef } from 'react'

const STEP_MS = 1000 / 60
const PARTICLE_COUNT = 1000
const LIFETIME = 600

// A browser port of the original C++ particle system's Unlocked Mode.
export default function ChaosWallpaper() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        const parent = canvas?.parentElement
        if (!context || !parent) return

        const particles = new Array(PARTICLE_COUNT)
        let nextParticle = 0
        let width = 1
        let height = 1
        let scale = 1
        let ratio = 1
        let frame = null
        let previousTime = null
        let accumulatedTime = 0

        function resize() {
            const rect = parent.getBoundingClientRect()
            width = Math.max(1, rect.width)
            height = Math.max(1, rect.height)
            ratio = Math.min(window.devicePixelRatio || 1, 2)
            // Keep desktop and gallery previews at the same visual scale.
            scale = Math.min(width / 1080, height / 720)
            canvas.width = Math.round(width * ratio)
            canvas.height = Math.round(height * ratio)
        }

        function update() {
            const halfWidth = width / (2 * scale)
            const halfHeight = height / (2 * scale)

            for (const particle of particles) {
                if (!particle || particle.age <= 0) continue
                if (particle.x >= halfWidth || particle.x <= -halfWidth) {
                    particle.vx = -particle.vx
                }
                if (particle.y >= halfHeight || particle.y <= -halfHeight) {
                    particle.vy = -particle.vy
                }
                particle.x += particle.vx
                particle.y += particle.vy
                particle.age--
            }

            const angle = (Math.random() * 360 - 180) * Math.PI / 180
            nextParticle = (nextParticle + 1) % PARTICLE_COUNT
            particles[nextParticle] = {
                x: 0,
                y: 0,
                // The C++ code stores velocity components as integers.
                vx: Math.trunc(20 * Math.cos(angle)),
                vy: Math.trunc(20 * Math.sin(angle)),
                size: 50 * Math.random(),
                shape: 3 * Math.random(),
                colour: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
                age: LIFETIME,
            }
        }

        function paint() {
            context.setTransform(ratio, 0, 0, ratio, 0, 0)
            context.fillStyle = '#000'
            context.fillRect(0, 0, width, height)
            context.translate(width / 2, height / 2)
            context.scale(scale, scale)

            for (const particle of particles) {
                if (!particle || particle.age <= 0) continue
                const { x, y, size, shape, colour } = particle
                const point = size * shape

                // The same outline used by Square::draw() in the original.
                context.beginPath()
                context.moveTo(x - size, y + size)
                context.lineTo(x - point, y)
                context.lineTo(x - size, y - size)
                context.lineTo(x, y - point)
                context.lineTo(x + size, y - size)
                context.lineTo(x + point, y)
                context.lineTo(x + size, y + size)
                context.lineTo(x, y + point)
                context.closePath()
                context.fillStyle = colour
                context.fill()
            }
        }

        function animate(time) {
            if (previousTime !== null) {
                accumulatedTime += Math.min(time - previousTime, 100)
            }
            previousTime = time

            while (accumulatedTime >= STEP_MS) {
                update()
                accumulatedTime -= STEP_MS
            }
            paint()
            frame = requestAnimationFrame(animate)
        }

        function onVisibilityChange() {
            if (frame !== null) cancelAnimationFrame(frame)
            frame = null
            previousTime = null
            accumulatedTime = 0
            if (!document.hidden) frame = requestAnimationFrame(animate)
        }

        const observer = new ResizeObserver(resize)
        observer.observe(parent)
        resize()
        paint()
        onVisibilityChange()
        document.addEventListener('visibilitychange', onVisibilityChange)

        return () => {
            observer.disconnect()
            document.removeEventListener('visibilitychange', onVisibilityChange)
            if (frame !== null) cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ display: 'block', width: '100%', height: '100%' }}
        />
    )
}
