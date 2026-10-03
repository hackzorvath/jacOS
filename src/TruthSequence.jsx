import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useSystemError } from './SystemError.jsx'
import './TruthSequence.css'
import { RESET_TRANSIENT_UI } from './system/systemEvents.js'

const TruthSequenceContext = createContext(null)

const TRUTH_URL = 'https://github.com/hackzorvath'

function wait(ms) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })
}

export function TruthSequenceProvider({ children }) {
  const { playErrorSound } = useSystemError()

  const [isOpen, setIsOpen] = useState(false)
  const [output, setOutput] = useState('')

  const runningRef = useRef(false)
  const cancelledRef = useRef(false)
  const dialupRef = useRef(null)

  /*
   * Preload the dial-up sound once.
   */
  useEffect(() => {
    const audio = new Audio(
      `${import.meta.env.BASE_URL}audio/dial-up.mp3`
    )

    audio.preload = 'auto'
    audio.load()

    dialupRef.current = audio

    return () => {
      audio.pause()
      dialupRef.current = null
    }
  }, [])

  function append(text) {
    setOutput(previous => previous + text)
  }

  function appendLine(text = '') {
    setOutput(previous => previous + text + '\n')
  }

  /*
   * Type text without automatically adding
   * a newline afterward.
   */
  async function typeText(
    text,
    speed = 55,
  ) {
    for (const character of text) {
      if (cancelledRef.current) {
        return false
      }

      append(character)

      await wait(speed)
    }

    return true
  }

  /*
   * Type text and then press Enter.
   */
  async function typeLine(
    text,
    speed = 55,
  ) {
    const completed = await typeText(
      text,
      speed,
    )

    if (!completed) {
      return false
    }

    append('\n')

    return true
  }

  /*
   * Safari/iPadOS may reject audio that first
   * attempts to play several seconds after the
   * original user interaction.
   *
   * Touch the audio element immediately from
   * the truth.exe activation.
   */
  function unlockDialup() {
    const audio = dialupRef.current

    if (!audio) {
      return
    }

    audio.volume = 0
    audio.currentTime = 0

    audio.play()
      .then(() => {
        audio.pause()
        audio.currentTime = 0
        audio.volume = 1
      })
      .catch(error => {
        console.error(
          'Could not unlock dial-up audio:',
          error,
        )

        audio.volume = 1
      })
  }

  function playDialup() {
    const audio = dialupRef.current

    if (!audio) {
      return
    }

    audio.pause()
    audio.currentTime = 0
    audio.volume = 1

    audio.play().catch(error => {
      console.error(
        'Dial-up audio failed:',
        error,
      )
    })
  }

  function stopDialup() {
    const audio = dialupRef.current

    if (!audio) {
      return
    }

    audio.pause()
    audio.currentTime = 0
  }

  async function startTruthSequence() {
    if (runningRef.current) {
      return
    }

    /*
     * Do this before the first await so Safari
     * still sees the original double-click.
     */
    unlockDialup()

    runningRef.current = true
    cancelledRef.current = false

    setOutput('')
    setIsOpen(true)

    /*
     * Start like a reasonably normal shell.
     */
    await wait(350)

    await typeLine(
      'jacOS $> ./src/truth.exe',
      22,
    )

    await wait(150)

    appendLine(
      'bash: ./src/truth.exe: cannot execute binary file'
    )

    /*
     * Windows inexplicably complains
     * from inside Linux.
     */
    playErrorSound()

    await wait(850)

    /*
     * And now things begin to deteriorate.
     */
    await typeLine(
      'Execute?',
      85,
    )

    await wait(750)

    /*
     * "Should I" at ordinary typewriter speed.
     *
     * Do NOT press Enter yet.
     */
    await typeText(
      'Should I',
      80,
    )

    /*
     * The ellipsis develops one uncomfortable
     * thought at a time.
     */
    await typeText('.', 500)
    await typeText('.', 500)
    await typeText('.', 500)

    /*
     * Sit with that question for a moment.
     */
    await wait(1100)

    /*
     * The ancient machinery awakens.
     */
    playDialup()

    /*
     * Finish the sentence on the same line.
     */
    await typeLine(
      ' kill it?',
      80,
    )

    /*
     * Three vertical dots occupy the remainder
     * of the roughly six-second modem sound.
     *
     * kill it? takes ~700ms to type, leaving
     * approximately 5.3 seconds for these.
     */
    await wait(700)

    await typeLine('.', 180)
    await wait(1450)

    await typeLine('.', 180)
    await wait(1450)

    await typeLine('.', 180)
    await wait(1450)

    /*
     * The six-second modem scream should be
     * essentially finished by now.
     */
    stopDialup()

    await wait(350)

    /*
     * Microsoft has entered the chat.
     */
    await typeLine(
      'MICROSOFT OVERRIDE',
      95,
    )

    await wait(850)

    await typeLine(
      'executing source of truth...',
      60,
    )

    await wait(1200)

    if (!cancelledRef.current) {
      window.location.assign(TRUTH_URL)
    }

    runningRef.current = false
  }

  function closeTruthSequence() {
    cancelledRef.current = true
    runningRef.current = false

    stopDialup()

    setIsOpen(false)
    setOutput('')
  }

  return (
    <TruthSequenceContext.Provider
      value={{ startTruthSequence }}
    >
      {children}

      {isOpen && (
        <section
          className="truth-terminal"
          role="dialog"
          aria-label="Terminal"
        >
          <header className="truth-terminal__titlebar">
            <span>
              jack@workstation: ~
            </span>

            <button
              type="button"
              aria-label="Close terminal"
              onClick={closeTruthSequence}
            >
              ×
            </button>
          </header>

          <pre className="truth-terminal__output">
            {output}
            <span
              className="truth-terminal__cursor"
              aria-hidden="true"
            >
              █
            </span>
          </pre>
        </section>
      )}
    </TruthSequenceContext.Provider>
  )
}

export function useTruthSequence() {
  const context =
    useContext(TruthSequenceContext)

  if (!context) {
    throw new Error(
      'useTruthSequence must be used inside TruthSequenceProvider'
    )
  }

  return context
}