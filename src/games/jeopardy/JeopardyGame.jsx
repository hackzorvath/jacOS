import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { loadBoard, VALUES } from './trivia.js'
import CategoryIcon, { SHORT_CATEGORY_LABELS } from './CategoryIcon.jsx'
import './JeopardyGame.css'
import './JeopardyGame.newton.css'
import './JeopardyGame.bsod.css'

function Money({ value }) {
    return <span className="jeopardy-money">{value < 0 ? '-$' : '$'}{Math.abs(value).toLocaleString('en-CA')}</span>
}

function ClueTile({ clue, used, onChoose, calendar }) {
    return (
        <button
            type="button"
            className={`jeopardy-tile${used ? ' jeopardy-tile--used' : ''}`}
            disabled={used}
            onClick={() => onChoose(clue)}
            aria-label={`${clue.category}, $${clue.value}${used ? ', played' : ''}`}
        >
            <span aria-hidden="true">
                {used ? <span className="jeopardy-used-mark">×</span> : calendar ? clue.value : <Money value={clue.value} />}
            </span>
        </button>
    )
}

function QuestionGrid({ categories, used, onChoose, calendar = false }) {
    return (
        <div className="jeopardy-grid" style={{ '--jeopardy-columns': categories.length }} role="group" aria-label="Trivia board">
            {categories.map(category => (
                <div key={category.id} className="jeopardy-category" title={category.label}>
                    {calendar ? (
                        <>
                            <span className="jeopardy-category-icon"><CategoryIcon category={category.id} /></span>
                            <span aria-hidden="true">{SHORT_CATEGORY_LABELS[category.id] || category.label}</span>
                            <span className="jeopardy-sr-only">{category.label}</span>
                        </>
                    ) : category.label}
                </div>
            ))}
            {VALUES.map((_, row) => categories.map(category => (
                <ClueTile
                    key={category.clues[row].id}
                    clue={category.clues[row]}
                    used={used.includes(category.clues[row].id)}
                    onChoose={onChoose}
                    calendar={calendar}
                />
            )))}
        </div>
    )
}

// Keep the original import and app id working. Desktop opts in with variant="bsod".
export default function JeopardyGame({ variant = 'newton' }) {
    const theme = variant === 'bsod' ? 'bsod' : 'newton'
    const calendar = theme === 'newton'
    const [board, setBoard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [score, setScore] = useState(0)
    const [used, setUsed] = useState([])
    const [activeClue, setActiveClue] = useState(null)
    const [phase, setPhase] = useState('clue') // wager | clue | reveal
    const [wager, setWager] = useState(100)
    const [mobilePage, setMobilePage] = useState(0)
    const [lastResult, setLastResult] = useState('')
    const controllerRef = useRef(null)
    const settledRef = useRef(false)
    const focusTargetRef = useRef(null)
    const mainRef = useRef(null)
    const wagerId = useId()

    const startGame = useCallback(async () => {
        controllerRef.current?.abort()
        const controller = new AbortController()
        controllerRef.current = controller
        setLoading(true)
        setError('')
        setActiveClue(null)
        setLastResult('')

        try {
            const nextBoard = await loadBoard(controller.signal)
            if (controller.signal.aborted) return
            setBoard(nextBoard)
            setScore(0)
            setUsed([])
            setWager(100)
            setMobilePage(0)
        } catch (err) {
            if (controller.signal.aborted) return
            setError(err instanceof Error ? err.message : 'Unable to fetch trivia.')
        } finally {
            if (!controller.signal.aborted) setLoading(false)
        }
    }, [])

    useEffect(() => {
        void startGame()
        return () => controllerRef.current?.abort()
    }, [startGame])

    const totalClues = board ? board.length * VALUES.length : 30
    const finished = Boolean(board && used.length === totalClues)
    const maxWager = Math.max(500, score)
    const validWager = Number.isInteger(Number(wager)) && Number(wager) >= 1 && Number(wager) <= maxWager
    const pageCount = board ? Math.ceil(board.length / 2) : 0

    // Announce the new screen and give keyboard users a useful starting point.
    useEffect(() => {
        if (!loading) {
            if (mainRef.current) mainRef.current.scrollTop = 0
            focusTargetRef.current?.focus({ preventScroll: true })
        }
    }, [loading, error, activeClue?.id, phase, finished])

    function chooseClue(clue) {
        if (loading || activeClue || used.includes(clue.id)) return
        settledRef.current = false
        setActiveClue(clue)
        setWager(100)
        setPhase(clue.dailyDouble ? 'wager' : 'clue')
    }

    function finishClue(correct) {
        if (!activeClue || phase !== 'reveal' || settledRef.current) return
        settledRef.current = true
        const amount = activeClue.dailyDouble ? Number(wager) : activeClue.value
        setScore(oldScore => oldScore + (correct ? amount : -amount))
        setUsed(oldUsed => [...oldUsed, activeClue.id])
        setLastResult(`${correct ? 'Correct' : 'Incorrect'}: ${correct ? '+' : '−'}$${amount.toLocaleString('en-CA')}`)
        setActiveClue(null)
    }

    return (
        <section className={`jeopardy-game jparty--${theme}`} aria-label="jParty trivia game">
            <header className="jeopardy-topbar">
                <div className="jeopardy-brand"><span className="jeopardy-brand-mark" aria-hidden="true">▦</span><h1>jParty</h1></div>
                <div className="jeopardy-score" aria-live="polite" aria-atomic="true">
                    <span>SCORE</span><strong><Money value={score} /></strong>
                </div>
            </header>

            <div className="jeopardy-main" ref={mainRef}>
                {loading ? (
                    <div className="jeopardy-message" role="status">
                        <span className="jeopardy-screen-label">{calendar ? 'RECEIVING TRIVIA' : 'LOADING QUESTIONS.EXE'}</span>
                        <h2>Preparing the board...</h2>
                        <p>Collecting trivia from the outside world.</p>
                    </div>
                ) : error ? (
                    <div className="jeopardy-message" role="alert">
                        <h2 ref={focusTargetRef} tabIndex={-1}>Question supply interrupted</h2>
                        <p>{error}</p>
                        <button type="button" onClick={startGame}>Try Again</button>
                    </div>
                ) : finished ? (
                    <div className="jeopardy-message">
                        <span className="jeopardy-screen-label">{calendar ? 'TRANSMISSION COMPLETE' : 'TRIVIA PROCESS TERMINATED'}</span>
                        <h2 ref={focusTargetRef} tabIndex={-1}>Final Score</h2>
                        <div className="jeopardy-final-score"><Money value={score} /></div>
                        <p>All {totalClues} clues played!</p>
                        <button type="button" onClick={startGame}>New Game</button>
                    </div>
                ) : activeClue ? (
                    <article className="jeopardy-clue-screen">
                        <div className="jeopardy-transmission">
                            <span>{activeClue.dailyDouble ? 'DAILY DOUBLE' : calendar ? 'INCOMING CLUE' : 'TRIVIA EXCEPTION'}</span>
                            <span>{String(used.length + 1).padStart(2, '0')} / {totalClues}</span>
                        </div>
                        <h2 className="jeopardy-clue-meta" ref={focusTargetRef} tabIndex={-1}>
                            <span>{activeClue.category}</span>
                            <span><Money value={activeClue.dailyDouble ? Number(wager) : activeClue.value} /></span>
                        </h2>

                        {phase === 'wager' ? (
                            <div className="jeopardy-clue-content">
                                <h3>Daily Double!</h3>
                                <p>How much are you willing to wager?</p>
                                <label className="jeopardy-wager-label" htmlFor={wagerId}>Your wager</label>
                                <input
                                    id={wagerId}
                                    className="jeopardy-wager"
                                    type="number"
                                    inputMode="numeric"
                                    min="1"
                                    max={maxWager}
                                    step="1"
                                    value={wager}
                                    aria-describedby={`${wagerId}-hint`}
                                    onChange={event => setWager(event.target.value)}
                                />
                                <p id={`${wagerId}-hint`} className="jeopardy-hint">Whole dollars, $1–${maxWager.toLocaleString('en-CA')}.</p>
                                <button type="button" disabled={!validWager} onClick={() => { if (validWager) setPhase('clue') }}>Lock It In</button>
                            </div>
                        ) : phase === 'clue' ? (
                            <div className="jeopardy-clue-content">
                                <p className="jeopardy-question">{activeClue.question}</p>
                                {!calendar && <p className="jeopardy-hint">Think of your answer, then reveal.</p>}
                                <button type="button" onClick={() => setPhase('reveal')}>Reveal Answer</button>
                            </div>
                        ) : (
                            <div className="jeopardy-clue-content">
                                <p className="jeopardy-hint">CORRECT ANSWER</p>
                                <p className="jeopardy-answer">{activeClue.answer}</p>
                                {!calendar && <p>How did you do?</p>}
                                <div className="jeopardy-actions">
                                    <button type="button" onClick={() => finishClue(true)}>Correct <span>(+<Money value={activeClue.dailyDouble ? Number(wager) : activeClue.value} />)</span></button>
                                    <button type="button" className="jeopardy-button--secondary" onClick={() => finishClue(false)}>Incorrect <span>(−<Money value={activeClue.dailyDouble ? Number(wager) : activeClue.value} />)</span></button>
                                </div>
                            </div>
                        )}
                    </article>
                ) : (
                    <div className="jeopardy-board-screen">
                        {calendar ? (
                            <h2 className="jeopardy-sr-only" ref={focusTargetRef} tabIndex={-1}>Trivia board</h2>
                        ) : (
                            <div className="jeopardy-board-heading">
                                <h2 ref={focusTargetRef} tabIndex={-1}>A trivia exception has occurred.</h2>
                                <p>Select a value to continue.</p>
                            </div>
                        )}
                        {calendar ? (
                            <div className="jeopardy-calendar">
                                <QuestionGrid categories={board} used={used} onChoose={chooseClue} calendar />
                            </div>
                        ) : (
                            <>
                                <div className="jeopardy-board--desktop"><QuestionGrid categories={board} used={used} onChoose={chooseClue} /></div>
                                <div className="jeopardy-board--mobile">
                                    <nav className="jeopardy-page-controls" aria-label="Category pages">
                                        <button type="button" disabled={mobilePage === 0} onClick={() => setMobilePage(page => Math.max(0, page - 1))} aria-label="Previous categories">‹</button>
                                        <span>CATEGORIES {mobilePage * 2 + 1}–{Math.min(mobilePage * 2 + 2, board.length)}</span>
                                        <button type="button" disabled={mobilePage >= pageCount - 1} onClick={() => setMobilePage(page => Math.min(pageCount - 1, page + 1))} aria-label="Next categories">›</button>
                                    </nav>
                                    <QuestionGrid categories={board.slice(mobilePage * 2, mobilePage * 2 + 2)} used={used} onChoose={chooseClue} />
                                </div>
                            </>
                        )}
                        <div className="jeopardy-progress">
                            <span>{String(used.length).padStart(2, '0')} / {totalClues} PLAYED</span>
                            <span className="jeopardy-result" role="status" aria-atomic="true">{lastResult || (calendar ? '' : 'Your move.')}</span>
                        </div>
                    </div>
                )}
            </div>
            <footer className="jeopardy-footer">
                <a href="https://the-trivia-api.com/" target="_blank" rel="noopener noreferrer">Questions: The Trivia API (CC BY-NC 4.0)</a>
                {!calendar && !loading && !activeClue && !error && !finished && <button type="button" onClick={startGame}>New Game</button>}
            </footer>
        </section>
    )
}
