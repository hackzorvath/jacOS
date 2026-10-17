import JeopardyGame from './jeopardy/JeopardyGame.jsx'

const GAME_COMPONENTS = { jeopardy: JeopardyGame }

export default function GameHost({ game }) {
    const Component = GAME_COMPONENTS[game.id]
    if (!Component) return <p role="alert">This game could not be opened.</p>
    return <Component variant={game.variant} />
}
