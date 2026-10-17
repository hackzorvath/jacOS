import { EXTERNAL_LINKS } from '../system/externalLinks.js'
import newtonGamesIcon from '../assets/newton/games.png'
import newtonJetpack from '../assets/newton/newton-jetpack.png'
import siftJetpack from '../assets/newton/sift-jetpack.png'
import jpartyIcon from '../../public/icons/jparty.png'
import jpartyNewtonIcon from '../assets/newton/jparty.png'

// A Newton presentation also works in a desktop window. Omit `newton` for
// desktop-only games; set `desktop` when a game has its own desktop treatment.
export const GAMES = [
    {
        id: 'jeopardy',
        name: 'jParty',
        type: 'internal',
        desktop: { variant: 'bsod', iconSrc: jpartyIcon },
        newton: { variant: 'newton', iconSrc: jpartyNewtonIcon },
    },
    {
        id: 'sift',
        name: 'Sift',
        type: 'link',
        href: EXTERNAL_LINKS.sift,
        desktop: { iconSrc: `${import.meta.env.BASE_URL}icons/gbjam14.png` },
        newton: {
            lightIconSrc: newtonJetpack,
            darkIconSrc: siftJetpack,
        },
    },
]

export function getGamesFor(platform, catalogue = GAMES) {
    return catalogue.flatMap(game => {
        const presentation = platform === 'desktop'
            ? game.desktop ?? game.newton
            : platform === 'newton' ? game.newton : null
        return presentation ? [{ ...game, ...presentation }] : []
    })
}

export function getGameById(id, platform = 'desktop') {
    return getGamesFor(platform).find(game => game.id === id)
}
