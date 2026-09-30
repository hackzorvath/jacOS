import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import './SystemError.css'

const SystemErrorContext = createContext(null)

export function SystemErrorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef(null)

  /*
   * Preload the sound as soon as the app starts.
   *
   * This avoids creating/loading the Audio object
   * at the moment the user triggers an error.
   */
  useEffect(() => {
    const audio = new Audio(
      `${import.meta.env.BASE_URL}audio/xp-error.mp3`
    )

    audio.preload = 'auto'
    audio.load()

    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  function playErrorSound() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    /*
     * Rewind first so rapidly triggering another
     * error restarts the sound immediately.
     */
    audio.pause()
    audio.currentTime = 0

    audio.play().catch(() => {
      /*
       * If the browser blocks audio, the modal
       * should still appear normally.
       */
    })
  }

  function showSystemError() {
    playErrorSound()
    setIsOpen(true)
  }

  function closeSystemError() {
    setIsOpen(false)
  }

  return (
    <SystemErrorContext.Provider value={{ showSystemError, playErrorSound }}>
      {children}

      {isOpen && (
        <div className="xp-error-backdrop">
          <section
            className="xp-error"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="xp-error-title"
            aria-describedby="xp-error-message"
          >
            <header className="xp-error__titlebar">
              <span id="xp-error-title">
                Error
              </span>

              <button
                type="button"
                className="xp-error__close"
                aria-label="Close"
                onClick={closeSystemError}
              >
                ×
              </button>
            </header>

            <div className="xp-error__body">
              <div
                className="xp-error__icon"
                aria-hidden="true"
              >
                ×
              </div>

              <p id="xp-error-message">
                Windows cannot complete the requested operation.
              </p>
            </div>

            <footer className="xp-error__footer">
              <button
                type="button"
                className="xp-error__button"
                autoFocus
                onClick={closeSystemError}
              >
                OK
              </button>
            </footer>
          </section>
        </div>
      )}
    </SystemErrorContext.Provider>
  )
}

export function useSystemError() {
  const context = useContext(SystemErrorContext)

  if (!context) {
    throw new Error(
      'useSystemError must be used inside SystemErrorProvider'
    )
  }

  return context
}