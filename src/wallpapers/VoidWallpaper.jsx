import { useEffect, useRef } from 'react'

export default function VoidWallpaper() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')

        function drawVoid() {
            const ratio = window.devicePixelRatio || 1

            const width = window.innerWidth
            const height = window.innerHeight

            canvas.width = width * ratio
            canvas.height = height * ratio

            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            context.setTransform(ratio, 0, 0, ratio, 0, 0)

            context.fillStyle = '#000000'
            context.fillRect(0, 0, width, height)
        }

        drawVoid()

        window.addEventListener('resize', drawVoid)

        return () => {
            window.removeEventListener('resize', drawVoid)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
        />
    )
}