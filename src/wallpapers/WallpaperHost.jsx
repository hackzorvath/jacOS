import './WallpaperHost.css'

import {
    WALLPAPERS,
    DEFAULT_STATIC_WALLPAPER_ID,
} from '../system/wallpapers.js'

export default function WallpaperHost({
    wallpaperId,
}) {
    const wallpaper =
        WALLPAPERS[wallpaperId] ??
        WALLPAPERS[DEFAULT_STATIC_WALLPAPER_ID]

    const Wallpaper = wallpaper.component

    return (
        <div className="wallpaper-host">
            <Wallpaper key={wallpaper.id} />
        </div>
    )
}