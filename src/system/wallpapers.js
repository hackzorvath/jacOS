import JammyWallpaper from '../wallpapers/JammyWallpaper.jsx'
import VoidWallpaper from '../wallpapers/VoidWallpaper.jsx'
import MatrixWallpaper from '../wallpapers/MatrixWallpaper.jsx'
import StarfieldWallpaper from '../wallpapers/StarfieldWallpaper.jsx'
import ChaosWallpaper from '../wallpapers/ChaosWallpaper.jsx'
import GasWallpaper from '../wallpapers/GasWallpaper.jsx'

export const WALLPAPERS = {
    jammy: {
        id: 'jammy',
        name: 'Jammy Jellyfish',
        description: 'Ubuntu 22.04 LTS',
        type: 'static',
        component: JammyWallpaper,
    },

    void: {
        id: 'void',
        name: 'The Void',
        description: 'Nothing, professionally rendered.',
        type: 'dynamic',
        component: VoidWallpaper,
    },

    matrix: {
        id: 'matrix',
        name: 'The Matrix',
        description: 'Wake up.',
        type: 'dynamic',
        component: MatrixWallpaper,
    },
    starfield: {
        id: 'starfield',
        name: 'Starfield',
        description: 'Please remain seated during transit.',
        type: 'dynamic',
        component: StarfieldWallpaper,
    },
    chaos: {
        id: 'chaos',
        name: 'Chaos',
        description: 'Younger Jack was left unsupervised.',
        type: 'dynamic',
        component: ChaosWallpaper,
    },
    gas: {
        id: 'gas',
        name: 'Gas',
        description: 'Gaseous phenomena. Questionable atmosphere.',
        type: 'dynamic',
        component: GasWallpaper,
    },
}

export const DEFAULT_STATIC_WALLPAPER_ID = 'jammy'
export const DEFAULT_DYNAMIC_WALLPAPER_ID = 'void'