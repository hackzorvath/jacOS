import { getGameById } from './games/catalogue.js'
import GameHost from './games/GameHost.jsx'
import { useRef, useState } from 'react'
import '@fontsource/pixelify-sans/500.css'
import '@fontsource/pixelify-sans/700.css'
import './NewtonShell.css'

import NewtonLauncher from './NewtonLauncher.jsx'
import { WORK_APPS, GAME_APPS } from './apps.js'

import JeopardyGame from './games/j-party/JeopardyGame.jsx'

import NewtonFieldNotes from './NewtonFieldNotes.jsx'
import TerminalApp from './TerminalApp.jsx'
import CoursesApp from './CoursesApp.jsx'
import TrashApp from './TrashApp.jsx'
import { DEFAULT_RADIO_STATION } from './system/radio.js'
import NewtonPager from './NewtonPager.jsx'

import radioIcon from './assets/newton/radio.png'
import homeIcon from './assets/newton/home.png'
import pagerIcon from './assets/newton/pager.png'

export default function NewtonShell() {
    const standalone =
        window.navigator.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches

    const [activeApp, setActiveApp] = useState(null)
    const [darkMode, setDarkMode] = useState(false)

    const audioRef = useRef(null)

    const [radioOn, setRadioOn] = useState(false)
    const [radioError, setRadioError] = useState(false)


    function toggleRadio() {
        const audio = audioRef.current

        if (!audio) return

        if (!audio.paused) {
            audio.pause()
            setRadioOn(false)
            return
        }

        setRadioError(false)

        const playPromise = audio.play()

        // Don't wait for a live Icecast stream on iOS.
        setRadioOn(true)

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Radio playback failed:', error)

                setRadioOn(false)
                setRadioError(true)
            })
        }
    }


    function getFormattedDate() {
        return new Intl.DateTimeFormat('en-CA', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }).format(new Date())
    }


    function renderApp() {
        const game = getGameById(activeApp, 'newton')
        if (game?.type === 'internal') return <GameHost game={game} />

        switch (activeApp) {
            case 'work':
                return (
                    <NewtonLauncher
                        onOpenApp={setActiveApp}
                        darkMode={darkMode}
                        apps={WORK_APPS}
                        layout="work"
                    />
                )

            case 'games':
                return (
                    <NewtonLauncher
                        onOpenApp={setActiveApp}
                        darkMode={darkMode}
                        apps={GAME_APPS}
                        layout="folder"
                    />
                )

            case 'notes':
                return <NewtonFieldNotes />

            case 'terminal':
                return (
                    <TerminalApp
                        visible={true}
                        active={true}
                    />
                )

            case 'courses':
                return <CoursesApp />

            case 'trash':
                return <TrashApp />

            case 'pager':
                return <NewtonPager />

            default:
                return (
                    <NewtonLauncher
                        onOpenApp={setActiveApp}
                        darkMode={darkMode}
                    />
                )
        }
    }


    return (
        <main
            className={
                `newton-shell ${standalone
                    ? 'newton-shell--standalone'
                    : ''
                }`
            }
        >
            <div className="newton-screen">

                <header className="newton-header">
                    <span>jacOS</span>

                    <span>{getFormattedDate()}</span>

                    <span>{
                        activeApp === 'notes'
                            ? '/var/tmp'
                            : activeApp === 'pager'
                                ? '/var/spool/news'
                                : (getGameById(activeApp, 'newton')?.name ?? activeApp ?? 'Home')
                    }</span>
                </header>


                <div className="newton-content">
                    {renderApp()}
                </div>


                <nav className="newton-dock">
                    <audio
                        ref={audioRef}
                        src={DEFAULT_RADIO_STATION}
                        preload="none"
                        playsInline
                        onPause={() => setRadioOn(false)}
                        onError={(event) => {
                            console.error(
                                'Radio audio error:',
                                event.currentTarget.error
                            )
                            setRadioOn(false)
                            setRadioError(true)
                        }}
                    />
                    <button
                        type="button"
                        className={`newton-dock-button ${activeApp === 'pager' ? 'is-active' : ''}`}
                        aria-label="Pager"
                        onClick={() => setActiveApp('pager')}
                    >
                        <img
                            src={pagerIcon}
                            alt=""
                            className="newton-dock-icon"
                        />
                    </button>

                    <button
                        type="button"
                        className="newton-dock-button newton-dock-button--home"
                        aria-label="Home"
                        onClick={() => setActiveApp(null)}
                    >
                        <img
                            src={homeIcon}
                            alt=""
                            className="newton-dock-icon"
                        />
                    </button>

                    <button
                        type="button"
                        className={`newton-dock-button ${radioOn ? 'is-active' : ''}`}
                        aria-label="Radio"
                        onClick={toggleRadio}
                    >
                        <img
                            src={radioIcon}
                            alt=""
                            className="newton-dock-icon"
                        />
                    </button>
                </nav>

            </div>
        </main>
    )
}
