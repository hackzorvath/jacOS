// Small, code-native LCD glyphs keep the calendar related to Newton's launcher.
export const SHORT_CATEGORY_LABELS = {
    history: 'HIST',
    science: 'SCI',
    geography: 'GEO',
    arts_and_literature: 'ARTS',
    film_and_tv: 'FILM',
    society_and_culture: 'CULT',
}

export default function CategoryIcon({ category }) {
    const glyphs = {
        history: <><path d="M6 3h12M6 21h12M7 3v4l5 5-5 5v4M17 3v4l-5 5 5 5v4" /><path d="m9 19 3-3 3 3" /></>,
        science: <><path d="M9 3h6M10 3v7L4 19v2h16v-2l-6-9V3M8 15h8" /><path d="M10 18h1m3 0h1" /></>,
        geography: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" /></>,
        arts_and_literature: <><path d="M3 4h5l4 2 4-2h5v15h-5l-4 2-4-2H3zM12 6v15M6 8h2m-2 4h2m8-4h2m-2 4h2" /></>,
        film_and_tv: <><rect x="3" y="4" width="18" height="16" /><path d="M7 4v16M17 4v16M3 9h4m-4 6h4M17 9h4m-4 6h4m-10-6 4 3-4 3z" /></>,
        society_and_culture: <><circle cx="12" cy="6" r="3" /><path d="M7 21v-5a5 5 0 0 1 10 0v5M3 21v-5a4 4 0 0 1 3-4m15 9v-5a4 4 0 0 0-3-4" /><path d="M4 5a3 3 0 0 0 0 6m16-6a3 3 0 0 1 0 6" /></>,
    }

    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" aria-hidden="true" focusable="false">
            {glyphs[category] || <path d="M5 5h14v14H5zM9 9h6v6H9z" />}
        </svg>
    )
}
