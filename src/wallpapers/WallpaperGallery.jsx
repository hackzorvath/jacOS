import './WallpaperGallery.css'

import {
    WALLPAPERS,
} from '../system/wallpapers.js'

export default function WallpaperGallery({
    wallpaperId,
    dynamicWallpapersEnabled,
    onSetMode,
    dynamicWallpaperId,
    onSelectWallpaper,
}) {
    const mode =
        dynamicWallpapersEnabled
            ? 'dynamic'
            : 'static'

    const wallpapers = Object.values(WALLPAPERS)
        .filter(wallpaper => wallpaper.type === mode)

    const currentWallpaper = WALLPAPERS[wallpaperId]
    const CurrentWallpaper = currentWallpaper.component

    function selectWallpaper(id) {
        if (mode === 'dynamic') {
            onSelectWallpaper(id)
        }
    }

    return (
        <div className="wallpaper-gallery">

            <header className="wallpaper-gallery__header">
                <h1>Background</h1>
                <p>Personalize the jacOS desktop.</p>
            </header>


            {/* Mode tabs */}

            <div
                className="wallpaper-gallery__tabs"
                role="tablist"
                aria-label="Wallpaper type"
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'static'}
                    className={
                        mode === 'static'
                            ? 'wallpaper-gallery__tab wallpaper-gallery__tab--active'
                            : 'wallpaper-gallery__tab'
                    }
                    onClick={() => onSetMode('static')}
                >
                    Static
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'dynamic'}
                    className={
                        mode === 'dynamic'
                            ? 'wallpaper-gallery__tab wallpaper-gallery__tab--active'
                            : 'wallpaper-gallery__tab'
                    }
                    onClick={() => onSetMode('dynamic')}
                >
                    Dynamic
                </button>
            </div>


            {/* Current wallpaper */}

            <section className="wallpaper-gallery__hero">
                <div className="wallpaper-gallery__preview">
                    <CurrentWallpaper
                        key={`preview-${wallpaperId}`}
                    />

                    <div
                        className="wallpaper-gallery__preview-glass"
                        aria-hidden="true"
                    />
                </div>

                <div className="wallpaper-gallery__current-info">
                    <div>
                        <h2>{currentWallpaper.name}</h2>
                        <p>{currentWallpaper.description}</p>
                    </div>

                    <span className="wallpaper-gallery__current-label">
                        Current
                    </span>
                </div>
            </section>


            {/* Selection strip */}

            <section className="wallpaper-gallery__choices">
                <div className="wallpaper-gallery__choices-heading">
                    {mode === 'static'
                        ? 'Static backgrounds'
                        : 'Dynamic backgrounds'}
                </div>

                <div className="wallpaper-gallery__strip">
                    {wallpapers.map(wallpaper => {
                        const selected =
                            wallpaper.id === wallpaperId

                        const ThumbnailWallpaper =
                            wallpaper.component

                        return (
                            <button
                                key={wallpaper.id}
                                type="button"
                                className={[
                                    'wallpaper-card',
                                    selected
                                        ? 'wallpaper-card--selected'
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                onClick={() =>
                                    selectWallpaper(wallpaper.id)
                                }
                                aria-pressed={selected}
                            >
                                <div
                                    className={[
                                        'wallpaper-card__preview',
                                        `wallpaper-card__preview--${wallpaper.id}`,
                                    ].join(' ')}
                                >
                                    {wallpaper.id === 'jammy' && (
                                        <ThumbnailWallpaper />
                                    )}

                                    {wallpaper.id === 'matrix' && (
                                        <div className="matrix-card-preview">
                                            <span>0 ア 1</span>
                                            <span>カ 1 ソ</span>
                                            <span>1 エ 0</span>
                                            <span>ナ 0 1</span>
                                        </div>
                                    )}

                                    {selected && (
                                        <span
                                            className="wallpaper-card__selected-mark"
                                            aria-hidden="true"
                                        >
                                            ✓
                                        </span>
                                    )}
                                </div>

                                <span className="wallpaper-card__name">
                                    {wallpaper.name}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </section>

        </div>
    )
}