import clownSprite from './art/pixel-clown-v1.png'
import boxStates from './art/pixel-jackbox-states-v1.png'

export function JackBoxIcon({ open = false }) {
    return (
        <span
            className={`jack-box-icon jack-box-icon--pixel${open ? ' is-open' : ''}`}
            aria-hidden="true"
            style={{ backgroundImage: `url("${boxStates}")` }}
        />
    )
}

export function MenuClown() {
    return (
        <div className="jack-games-clown" aria-hidden="true">
            <svg className="jack-games-clown__spring" viewBox="0 0 150 70" fill="none" focusable="false">
                <path d="M4 58h24V48H16V38h36V28H40V18h36V8h28" stroke="#141b33" strokeWidth="9" strokeLinejoin="miter" />
                <path d="M4 58h24V48H16V38h36V28H40V18h36V8h28" stroke="#ffd34e" strokeWidth="4" strokeLinejoin="miter" />
            </svg>
            <img className="jack-games-clown__sprite" src={clownSprite} alt="" draggable="false" />
        </div>
    )
}
