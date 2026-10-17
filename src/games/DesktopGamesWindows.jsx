import DesktopWindow from '../DesktopWindow.jsx'
import GameHost from './GameHost.jsx'
import { getGamesFor } from './catalogue.js'
import './DesktopGamesWindows.css'

const INTERNAL_GAMES = getGamesFor('desktop').filter(game => game.type === 'internal')

export default function DesktopGamesWindows({ windows, onMinimize, onClose, onFocus, getZIndex }) {
    return INTERNAL_GAMES.map(game => {
        const running = windows[game.id] === 'open' || windows[game.id] === 'minimized'
        return (
            <DesktopWindow
                key={game.id}
                windowId={game.id}
                title={game.name}
                icon={<img className="desktop-game-window__icon" src={game.iconSrc} alt="" />}
                className={`desktop-game-window${game.desktop ? '' : ' desktop-game-window--pocket'}`}
                hidden={windows[game.id] !== 'open'}
                onMinimize={() => onMinimize(game.id)}
                onClose={() => onClose(game.id)}
                onFocus={() => onFocus(game.id)}
                zIndex={getZIndex(game.id)}
            >
                {running && <GameHost game={game} />}
            </DesktopWindow>
        )
    })
}
