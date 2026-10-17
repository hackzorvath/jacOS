import JeopardyGame from './JeopardyGame.jsx'

// Prepared separately: mount this inside a desktop window when ready.
// It shares Newton's engine and data source, with no desktop-shell changes.
export default function JeopardyDesktop() {
    return <JeopardyGame variant="bsod" />
}
