import { useRef, useState } from 'react'
import './NewtonShell.css'

import NewtonLauncher from './NewtonLauncher.jsx'
import NotesApp from './NotesApp.jsx'
import TerminalApp from './TerminalApp.jsx'
import CoursesApp from './CoursesApp.jsx'
import TrashApp from './TrashApp.jsx'
import { DEFAULT_RADIO_STATION } from './system/radio.js'

import radioIcon from './assets/newton/radio.png'
import homeIcon from './assets/newton/home.png'
import nightIcon from './assets/newton/dark.png'

export default function NewtonShell() {
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
        switch (activeApp) {
            case 'notes':
                return <NotesApp />

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
        <main className="newton-shell">
            <div className="newton-screen">

                <header className="newton-header">
                    <span>jacOS</span>

                    <span>{getFormattedDate()}</span>

                    <span>{activeApp ?? 'Home'}</span>
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
                        onError={() => {
                            setRadioOn(false)
                            setRadioError(true)
                        }}
                    />
                    {/* Radio */}

                    <button
                        type="button"
                        className="newton-dock-button"
                        onClick={toggleRadio}
                    >
                        <img
                            src={radioIcon}
                            alt=""
                            className="newton-dock-icon"
                        />

                        <span>
                            {radioError
                                ? 'Radio !'
                                : radioOn
                                    ? 'Radio ■'
                                    : 'Radio'}
                        </span>
                    </button>


                    {/* Home */}

                    <button
                        type="button"
                        className={
                            `newton-dock-button ${activeApp === null
                                ? 'is-active'
                                : ''
                            }`
                        }
                        onClick={() => setActiveApp(null)}
                    >
                        <img
                            src={homeIcon}
                            alt=""
                            className="newton-dock-icon"
                        />

                        <span>Home</span>
                    </button>


                    {/* Fake "dark mode" */}

                    <button
                        type="button"
                        className="newton-dock-button"
                        onClick={() =>
                            setDarkMode(current => !current)
                        }
                    >
                        <img
                            src={nightIcon}
                            alt=""
                            className="newton-dock-icon"
                        />

                        <span>
                            {darkMode ? 'Light' : 'Night'}
                        </span>
                    </button>

                </nav>

            </div>
        </main>
    )
}