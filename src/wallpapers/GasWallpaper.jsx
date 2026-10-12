import { useEffect, useRef } from 'react'

const PIXEL_SIZE = 1
const MAX_GRID_EDGE = 400
const INITIAL_SPEED = 4
const MAX_WEIGHT = 30
const STEP_MS = 1000 / 60

function createGrid(width, height) {
    const count = width * height

    return {
        mass: new Float64Array(count),
        momentumX: new Float64Array(count),
        momentumY: new Float64Array(count),
    }
}

function seedGrid(grid) {
    let totalMass = 0
    let totalX = 0
    let totalY = 0

    for (let i = 0; i < grid.mass.length; i++) {
        if (Math.random() >= 1 / 20) continue

        const mass = Math.random() * 3 * MAX_WEIGHT
        const vx = (Math.random() * 2 - 1) * INITIAL_SPEED
        const vy = (Math.random() * 2 - 1) * INITIAL_SPEED

        grid.mass[i] = mass
        grid.momentumX[i] = mass * vx
        grid.momentumY[i] = mass * vy

        totalMass += mass
        totalX += mass * vx
        totalY += mass * vy
    }

    if (totalMass === 0) return

    // Remove the random starting wind across the whole scene.
    const driftX = totalX / totalMass
    const driftY = totalY / totalMass

    for (let i = 0; i < grid.mass.length; i++) {
        grid.momentumX[i] -= grid.mass[i] * driftX
        grid.momentumY[i] -= grid.mass[i] * driftY
    }
}

function addInflow(grid, index, mass, vx, vy) {
    grid.mass[index] += mass
    grid.momentumX[index] += mass * vx
    grid.momentumY[index] += mass * vy
}

function stepGrid(source, target, width, height) {
    target.mass.fill(0)
    target.momentumX.fill(0)
    target.momentumY.fill(0)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x
            const mass = source.mass[index]
            if (mass <= 0) continue

            const vx = source.momentumX[index] / mass
            const vy = source.momentumY[index] / mass

            const newX = ((x + vx) % width + width) % width
            const newY = ((y + vy) % height + height) % height

            const left = Math.floor(newX)
            const bottom = Math.floor(newY)
            const right = (left + 1) % width
            const top = (bottom + 1) % height

            const fx = newX - left
            const fy = newY - bottom

            addInflow(
                target, bottom * width + left,
                mass * (1 - fx) * (1 - fy), vx, vy
            )
            addInflow(
                target, bottom * width + right,
                mass * fx * (1 - fy), vx, vy
            )
            addInflow(
                target, top * width + left,
                mass * (1 - fx) * fy, vx, vy
            )
            addInflow(
                target, top * width + right,
                mass * fx * fy, vx, vy
            )
        }
    }
}

export default function GasWallpaper() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        const parent = canvas?.parentElement
        if (!context || !parent) return

        const buffer = document.createElement('canvas')
        const bufferContext = buffer.getContext('2d')
        if (!bufferContext) return

        let width = 0
        let height = 0
        let image = null
        let current = null
        let next = null

        let frame = null
        let previousTime = null
        let accumulatedTime = 0

        function resize() {
            const rect = parent.getBoundingClientRect()
            const ratio = Math.min(window.devicePixelRatio || 1, 2)

            canvas.width = Math.max(1, Math.round(rect.width * ratio))
            canvas.height = Math.max(1, Math.round(rect.height * ratio))
            context.imageSmoothingEnabled = false

            // Match the screen's proportions while keeping chunky pixels.
            const cellSize = Math.max(
                PIXEL_SIZE,
                rect.width / MAX_GRID_EDGE,
                rect.height / MAX_GRID_EDGE
            )

            const newWidth = Math.max(1, Math.round(rect.width / cellSize))
            const newHeight = Math.max(1, Math.round(rect.height / cellSize))

            if (newWidth !== width || newHeight !== height) {
                width = newWidth
                height = newHeight

                buffer.width = width
                buffer.height = height

                image = bufferContext.createImageData(width, height)

                for (let i = 3; i < image.data.length; i += 4) {
                    image.data[i] = 255
                }

                current = createGrid(width, height)
                next = createGrid(width, height)
                seedGrid(current)

                previousTime = null
                accumulatedTime = 0
            }

            paint()
        }

        function paint() {
            if (!image || !current) return

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const weight = current.mass[y * width + x] / MAX_WEIGHT
                    const pixel = ((height - 1 - y) * width + x) * 4

                    image.data[pixel] = Math.min(1, weight) * 255
                    image.data[pixel + 1] =
                        Math.max(0, Math.min(1, weight - 1)) * 255
                    image.data[pixel + 2] =
                        Math.max(0, Math.min(1, weight - 2)) * 255
                }
            }

            bufferContext.putImageData(image, 0, 0)
            context.drawImage(buffer, 0, 0, canvas.width, canvas.height)
        }

        function animate(time) {
            if (previousTime !== null) {
                accumulatedTime += Math.min(time - previousTime, STEP_MS * 3)
            }

            previousTime = time

            while (accumulatedTime >= STEP_MS) {
                stepGrid(current, next, width, height)

                const old = current
                current = next
                next = old

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

            if (!document.hidden) {
                frame = requestAnimationFrame(animate)
            }
        }

        const observer = new ResizeObserver(resize)
        observer.observe(parent)

        resize()
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