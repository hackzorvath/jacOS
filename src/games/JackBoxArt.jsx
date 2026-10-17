// Original, code-native artwork. The lid and clown can animate independently.
export function JackBoxIcon({ open = false }) {
    return (
        <svg className={`jack-box-icon${open ? ' is-open' : ''}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <g fill="none" stroke="#edbd60" strokeWidth="3.2" strokeLinecap="round" className="jack-box-icon__spring">
                <path d="m30 31 10-4-14-4 14-4-11-4" />
            </g>
            <path d="M13 28h39v29H13z" fill="#65418b" stroke="#251d32" strokeWidth="2.4" />
            <path d="m52 28 7 5v23l-7 1z" fill="#43265d" stroke="#251d32" strokeWidth="2" />
            <path d="M15 52h35v5H15z" fill="#f29947" />
            <path d="m32 32 10 11-10 10-10-10z" fill="#f2a14d" />
            <path d="M34 37v8c0 5-7 5-7 0" fill="none" stroke="#392445" strokeWidth="2.7" />
            <path d="M59 40h3v-6h-4" fill="none" stroke="#f3c876" strokeWidth="2.6" />
            <circle cx="60" cy="33" r="3" fill="#f58a3b" stroke="#251d32" strokeWidth="1.5" />
            <g className="jack-box-icon__lid">
                <path d="m10 23 7-7h38l-4 7z" fill="#f7b252" stroke="#251d32" strokeWidth="2.3" />
                <path d="M10 23h44v7H10z" fill="#eb813c" stroke="#251d32" strokeWidth="2.3" />
                <path d="M15 26h33" stroke="#ffd88b" strokeWidth="1.5" />
            </g>
        </svg>
    )
}

export function MenuClown() {
    return (
        <svg className="jack-games-clown" viewBox="0 0 340 158" aria-hidden="true" focusable="false">
            <g stroke="#302237" strokeWidth="2.4" strokeLinejoin="round">
                <path d="M74 145c28 0 36-14 62-21m-38 27 18-15-11-3 26-7-8-8 27-6" fill="none" stroke="#e2b95b" strokeWidth="4" />
                <path d="M138 105c-35 1-48 12-66 26l-37 8 6 13 43-7 49-22m69-18c35 1 48 12 66 26l37 8-6 13-43-7-49-22" fill="#714b96" />
                <path d="M141 104h58l14 46h-86z" fill="#e77936" />
                <path d="m170 106 20 22-20 22-20-22z" fill="#714b96" />
                <circle cx="170" cy="129" r="4" fill="#f7d37c" />
                <path d="M142 87c-9-5-12 1-13 8-12 0-14 12-4 17 0 10 11 13 18 6 8 10 17 7 20-1 7 10 16 10 21 0 9 9 20 5 20-5 11-4 9-16-3-17-1-10-10-13-17-7z" fill="#f6e8cc" />
                <path d="M141 49c-9-12-25-6-23 5-13 0-17 15-7 21-7 14 7 25 17 17 2 9 13 10 20 4m51-47c9-12 25-6 23 5 13 0 17 15 7 21 7 14-7 25-17 17-2 9-13 10-20 4" fill="#e77b35" />
                <ellipse cx="170" cy="70" rx="33" ry="34" fill="#ffebd0" />
                <path d="M147 53q9-6 15 0m16 0q8-6 15 0" fill="none" strokeLinecap="round" />
                <ellipse cx="157" cy="64" rx="3" ry="5" fill="#302237" stroke="none" />
                <ellipse cx="183" cy="64" rx="3" ry="5" fill="#302237" stroke="none" />
                <ellipse cx="170" cy="74" rx="8" ry="7" fill="#d9563b" />
                <circle cx="147" cy="78" r="6" fill="#efa08b" stroke="none" />
                <circle cx="193" cy="78" r="6" fill="#efa08b" stroke="none" />
                <path d="M155 86q15 15 30 0" fill="#fff9e9" strokeLinecap="round" />
                <path d="m145 42 23-35 27 35z" fill="#704595" />
                <path d="m159 20 24 22h-14l-15-14z" fill="#f3a044" stroke="none" />
                <path d="M143 42q27-8 54 0" fill="none" stroke="#e6b955" strokeWidth="5" strokeLinecap="round" />
                <circle cx="168" cy="9" r="7" fill="#f4c86a" />
                <path d="M24 138c-5-7-12-3-9 4-9-1-13 5-7 9 5 3 15 1 22 2 8 2 14-5 10-10-3-4-9-4-16-5m292 0c5-7 12-3 9 4 9-1 13 5 7 9-5 3-15 1-22 2-8 2-14-5-10-10 3-4 9-4 16-5" fill="#ffebd0" />
            </g>
        </svg>
    )
}
