const canvas = document.getElementById('void-canvas')
const ctx = canvas.getContext('2d')

const homeLink = document.querySelector('.home-link')

let width = 0
let height = 0
let centerX = 0
let centerY = 0

let escapeMode = false

const PARTICLE_COUNT = 256
const particles = []

const hole = {
    radiusX: 256,
    radiusY: 96,
}


function resize() {
    width = window.innerWidth
    height = window.innerHeight

    const dpr = window.devicePixelRatio || 1

    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)

    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    )

    centerX = width / 2
    centerY = height / 2 + height * 0.03

    hole.radiusX =
        Math.max(120, width * 0.16)

    hole.radiusY =
        Math.max(34, width * 0.045)
}


function randomBinary() {
    return Math.random() < 0.5
        ? '0'
        : '1'
}


/*
 * Finds the edge of our elliptical black hole
 * along a particular angle.
 */
function getHoleDistance(angle) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    return 1 / Math.sqrt(
        (cos * cos) /
        (hole.radiusX * hole.radiusX)
        +
        (sin * sin) /
        (hole.radiusY * hole.radiusY)
    )
}


function resetParticle(
    particle,
    scatter = false,
    fromHole = false
) {
    const angle =
        Math.random() * Math.PI * 2

    const directionX =
        Math.cos(angle)

    const directionY =
        Math.sin(angle)

    const startDistance =
        Math.max(width, height) *
        (
            0.65 +
            Math.random() * 0.55
        )

    const holeDistance =
        getHoleDistance(angle) * 1.05

    let currentDistance

    if (fromHole) {
        /*
         * Escape mode:
         * emerge just outside the event horizon.
         */
        currentDistance = holeDistance
    }
    else if (scatter) {
        /*
         * Initial page load:
         * scatter particles throughout the journey.
         */
        const journey =
            0.15 +
            Math.random() * 0.85

        currentDistance =
            holeDistance +
            (
                startDistance -
                holeDistance
            ) *
            journey
    }
    else {
        /*
         * Normal void mode:
         * spawn far away.
         */
        currentDistance = startDistance
    }

    particle.x =
        centerX +
        directionX * currentDistance

    particle.y =
        centerY +
        directionY * currentDistance

    const speed =
        0.8 +
        Math.random() * 2.2

    /*
     * Base velocity points inward.
     *
     * Escape mode simply reverses it.
     */
    particle.vx =
        -directionX * speed

    particle.vy =
        -directionY * speed

    particle.startDistance =
        startDistance

    particle.char =
        randomBinary()

    particle.baseSize =
        20 +
        Math.random() * 22

    particle.minSize =
        3 +
        Math.random() * 3
}


function createParticles() {
    particles.length = 0

    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i += 1
    ) {
        const particle = {}

        resetParticle(
            particle,
            true
        )

        particles.push(particle)
    }
}


function drawBackground() {
    ctx.clearRect(
        0,
        0,
        width,
        height
    )

    if (escapeMode) {
        /*
         * The good void.
         */
        const bg =
            ctx.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                Math.max(width, height)
            )

        bg.addColorStop(
            0,
            '#fff7ed'
        )

        bg.addColorStop(
            0.45,
            '#fffaf5'
        )

        bg.addColorStop(
            1,
            '#ffffff'
        )

        ctx.fillStyle = bg
    }
    else {
        /*
         * The bad void.
         */
        const bg =
            ctx.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                Math.max(width, height) * 0.75
            )

        bg.addColorStop(
            0,
            '#020602'
        )

        bg.addColorStop(
            0.45,
            '#010301'
        )

        bg.addColorStop(
            1,
            '#000000'
        )

        ctx.fillStyle = bg
    }

    ctx.fillRect(
        0,
        0,
        width,
        height
    )
}


function drawBlackHole() {
    const glow =
        ctx.createRadialGradient(
            centerX,
            centerY,
            hole.radiusY * 0.2,
            centerX,
            centerY,
            hole.radiusX * 2.2
        )

    if (escapeMode) {
        glow.addColorStop(
            0,
            'rgba(255, 120, 0, 0)'
        )

        glow.addColorStop(
            0.18,
            'rgba(255, 120, 0, 0.22)'
        )

        glow.addColorStop(
            0.32,
            'rgba(255, 140, 0, 0.14)'
        )

        glow.addColorStop(
            0.52,
            'rgba(255, 170, 60, 0.06)'
        )

        glow.addColorStop(
            1,
            'rgba(255, 255, 255, 0)'
        )
    }
    else {
        glow.addColorStop(
            0,
            'rgba(0, 255, 120, 0)'
        )

        glow.addColorStop(
            0.25,
            'rgba(0, 255, 120, 0.10)'
        )

        glow.addColorStop(
            0.45,
            'rgba(0, 255, 120, 0.06)'
        )

        glow.addColorStop(
            1,
            'rgba(0, 0, 0, 0)'
        )
    }

    ctx.save()

    ctx.translate(
        centerX,
        centerY
    )

    ctx.scale(
        1,
        0.34
    )

    ctx.beginPath()

    ctx.arc(
        0,
        0,
        hole.radiusX * 1.5,
        0,
        Math.PI * 2
    )

    ctx.closePath()

    ctx.fillStyle = glow
    ctx.fill()

    /*
     * Keep the hole itself black in both worlds.
     */
    ctx.shadowBlur = 0

    ctx.beginPath()

    ctx.ellipse(
        0,
        0,
        hole.radiusX,
        hole.radiusY,
        0,
        0,
        Math.PI * 2
    )

    ctx.fillStyle =
        escapeMode
            ? '#ffffff'
            : '#000000'

    ctx.fill()

    ctx.restore()
}


function isInsideHole(x, y) {
    const dx =
        x - centerX

    const dy =
        y - centerY

    const value =
        (dx * dx) /
        (hole.radiusX * hole.radiusX)
        +
        (dy * dy) /
        (hole.radiusY * hole.radiusY)

    return value < 1
}


function updateParticles() {
    for (const particle of particles) {

        const dx =
            particle.x - centerX

        const dy =
            particle.y - centerY

        const distance =
            Math.hypot(dx, dy)

        const distanceRatio =
            Math.max(
                0,
                Math.min(
                    1,
                    distance /
                    particle.startDistance
                )
            )

        /*
         * 0 = far away
         * 1 = near the event horizon
         */
        const pull =
            1 - distanceRatio

        /*
         * Slow far away,
         * violent near the hole.
         *
         * This works in BOTH directions.
         *
         * In escape mode:
         * fast leaving the hole,
         * slow near the outside.
         */
        const speedMultiplier =
            0.35 +
            (
                3.65 *
                pull *
                pull
            )

        const direction =
            escapeMode
                ? -1
                : 1

        particle.x +=
            particle.vx *
            speedMultiplier *
            direction

        particle.y +=
            particle.vy *
            speedMultiplier *
            direction

        const newDistance =
            Math.hypot(
                particle.x - centerX,
                particle.y - centerY
            )

        if (!escapeMode) {
            /*
             * Swallowed:
             * respawn somewhere far away.
             */
            if (
                isInsideHole(
                    particle.x,
                    particle.y
                )
            ) {
                resetParticle(particle)
            }
        }
        else {
            /*
             * Escaped:
             * emit another particle from the hole.
             */
            if (
                newDistance >=
                particle.startDistance
            ) {
                resetParticle(
                    particle,
                    false,
                    true
                )
            }
        }
    }
}


function drawParticles() {
    for (const particle of particles) {

        const dx =
            particle.x - centerX

        const dy =
            particle.y - centerY

        const distance =
            Math.hypot(dx, dy)

        const distanceRatio =
            Math.max(
                0,
                Math.min(
                    1,
                    distance /
                    particle.startDistance
                )
            )

        /*
         * Near hole = tiny.
         * Far away = large.
         *
         * That means particles naturally SHRINK
         * while falling in and GROW while escaping.
         */
        const size =
            particle.minSize +
            (
                particle.baseSize -
                particle.minSize
            ) *
            distanceRatio

        const alpha =
            particle.alpha *
            (
                0.35 +
                distanceRatio * 0.65
            )

        ctx.save()

        ctx.font =
            `${size}px "Courier New", monospace`

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        if (escapeMode) {
            ctx.fillStyle =
                `rgba(220, 95, 0)`

            ctx.shadowColor =
                `rgba(255, 120, 0)`
        }
        else {
            ctx.fillStyle =
                `rgba(90, 255, 90)`

            ctx.shadowColor =
                `rgba(0, 255, 70)`
        }

        ctx.shadowBlur =
            Math.max(
                2,
                size * 0.2
            )

        ctx.fillText(
            particle.char,
            particle.x,
            particle.y
        )

        ctx.restore()
    }
}


function setEscapeMode(enabled) {
    escapeMode = enabled

    document.body.classList.toggle(
        'good-void',
        enabled
    )
}


homeLink.addEventListener(
    'mouseenter',
    () => setEscapeMode(true)
)

homeLink.addEventListener(
    'mouseleave',
    () => setEscapeMode(false)
)

/*
 * Same behaviour for keyboard navigation.
 */
homeLink.addEventListener(
    'focus',
    () => setEscapeMode(true)
)

homeLink.addEventListener(
    'blur',
    () => setEscapeMode(false)
)


function animate() {
    drawBackground()
    updateParticles()
    drawParticles()
    drawBlackHole()

    requestAnimationFrame(animate)
}


window.addEventListener(
    'resize',
    () => {
        resize()
        createParticles()
    }
)


resize()
createParticles()
animate()