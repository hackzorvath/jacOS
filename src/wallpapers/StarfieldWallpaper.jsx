import { useEffect, useRef } from 'react'

const STAR_COUNT = 220
const STAR_SPEED = 0.65
const FOCAL_LENGTH = 280

export default function StarfieldWallpaper() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')
        const parent = canvas.parentElement

        let width = 0
        let height = 0
        let animationFrame = null
        let stars = []
        let lastTime = performance.now()

        function createStar(randomDepth = true) {
            const depth =
                randomDepth
                    ? Math.random() * Math.max(width, height)
                    : Math.max(width, height)

            return {
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.max(1, depth),
                previousZ: Math.max(1, depth),
            }
        }

        function resize() {
            const rect = parent.getBoundingClientRect()

            width = Math.max(1, rect.width)
            height = Math.max(1, rect.height)

            const ratio = window.devicePixelRatio || 1

            canvas.width = width * ratio
            canvas.height = height * ratio

            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            context.setTransform(
                ratio,
                0,
                0,
                ratio,
                0,
                0,
            )

            stars = Array.from(
                { length: STAR_COUNT },
                () => createStar(true),
            )
        }

        function resetStar(star) {
            const replacement = createStar(false)

            star.x = replacement.x
            star.y = replacement.y
            star.z = replacement.z
            star.previousZ = replacement.z
        }

        function draw(time) {
            const delta = Math.min(
                time - lastTime,
                40,
            )

            lastTime = time

            context.fillStyle = '#03050b'
            context.fillRect(
                0,
                0,
                width,
                height,
            )

            const glow = context.createRadialGradient(
                width / 2,
                height / 2,
                0,
                width / 2,
                height / 2,
                Math.max(width, height) * 0.65,
            )

            glow.addColorStop(
                0,
                'rgba(55, 65, 110, 0.18)',
            )

            glow.addColorStop(
                1,
                'rgba(0, 0, 0, 0)',
            )

            context.fillStyle = glow

            context.fillRect(
                0,
                0,
                width,
                height,
            )

            context.lineCap = 'round'

            for (const star of stars) {
                star.previousZ = star.z
                star.z -= STAR_SPEED * delta

                if (star.z <= 1) {
                    resetStar(star)
                    continue
                }

                const x =
                    (star.x / star.z) *
                    FOCAL_LENGTH +
                    width / 2

                const y =
                    (star.y / star.z) *
                    FOCAL_LENGTH +
                    height / 2

                const previousX =
                    (star.x / star.previousZ) *
                    FOCAL_LENGTH +
                    width / 2

                const previousY =
                    (star.y / star.previousZ) *
                    FOCAL_LENGTH +
                    height / 2

                if (
                    x < 0 ||
                    x > width ||
                    y < 0 ||
                    y > height
                ) {
                    resetStar(star)
                    continue
                }

                const closeness =
                    1 -
                    star.z /
                    Math.max(width, height)

                const alpha =
                    Math.max(
                        0.15,
                        Math.min(1, closeness),
                    )

                context.beginPath()

                context.moveTo(
                    previousX,
                    previousY,
                )

                context.lineTo(x, y)

                context.strokeStyle =
                    `rgba(255, 255, 255, ${alpha})`

                context.lineWidth =
                    0.8 + closeness * 1.7

                context.stroke()
            }

            animationFrame =
                requestAnimationFrame(draw)
        }

        const resizeObserver =
            new ResizeObserver(resize)

        resizeObserver.observe(parent)

        resize()

        animationFrame =
            requestAnimationFrame(draw)

        return () => {
            resizeObserver.disconnect()

            if (animationFrame) {
                cancelAnimationFrame(
                    animationFrame,
                )
            }
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
        />
    )
}