import { useEffect, useRef } from 'react'

const CHARACTERS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコサシスセソ'

export default function MatrixWallpaper() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')

        let animationFrame
        let columns = []
        let width = 0
        let height = 0

        const fontSize = 16
        const fallSpeed = 1

        function resize() {
            const ratio = window.devicePixelRatio || 1

            width = window.innerWidth
            height = window.innerHeight

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

            const columnCount =
                Math.ceil(width / fontSize)

            columns = Array.from(
                { length: columnCount },
                () => Math.random() * -50,
            )

            context.fillStyle = '#000'
            context.fillRect(0, 0, width, height)
        }

        function draw() {
            context.fillStyle = 'rgba(0, 0, 0, 0.07)'
            context.fillRect(0, 0, width, height)

            context.fillStyle = '#00ff66'
            context.font = `${fontSize}px monospace`

            columns.forEach((y, index) => {
                const character =
                    CHARACTERS[
                    Math.floor(
                        Math.random() * CHARACTERS.length
                    )
                    ]

                const x = index * fontSize

                context.fillText(
                    character,
                    x,
                    y * fontSize,
                )

                if (
                    y * fontSize > height &&
                    Math.random() > 0.975
                ) {
                    columns[index] = 0
                } else {
                    columns[index] += fallSpeed
                }
            })

            animationFrame =
                requestAnimationFrame(draw)
        }

        resize()
        draw()

        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener(
                'resize',
                resize,
            )

            cancelAnimationFrame(animationFrame)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
        />
    )
}