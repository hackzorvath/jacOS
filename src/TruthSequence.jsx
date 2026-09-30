import {
  createContext,
  useContext,
  useRef,
  useState,
} from 'react'

import { useSystemError } from './SystemError.jsx'
import './TruthSequence.css'

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

  function append(text) {
    setOutput(previous => previous + text)
  }

  function appendLine(text = '') {
    setOutput(previous => previous + text + '\n')
  }

  async function typeLine(
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

    append('\n')

    return true
  }

  function stopDialup() {
    if (!dialupRef.current) {
      return
    }

    dialupRef.current.pause()
    dialupRef.current.currentTime = 0
    dialupRef.current = null
  }

  function playDialup() {
    /*
     * Deliberate placeholder.
     *
     * Nothing needs to exist here yet.
     */
    const audio = new Audio(
      `${import.meta.env.BASE_URL}audio/dial_up.mp3`
    )

    audio.preload = 'auto'

    dialupRef.current = audio

    audio.play().catch(() => {
      // No dial-up sound yet.
    })
  }

  async function startTruthSequence() {
    if (runningRef.current) {
      return
    }

    runningRef.current = true
    cancelledRef.current = false

    setOutput('')
    setIsOpen(true)

    /*
     * Start like a reasonably normal shell.
     */
    await wait(350)

    await typeLine(
      '$ ./src/truth.exe',
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

    await wait(650)

    await typeLine(
      'Should I... kill it?',
      80,
    )

    await wait(1100)

    /*
     * The ancient machinery awakens.
     */
    playDialup()

    await typeLine('.', 180)

    await wait(550)

    await typeLine('.', 180)

    await wait(550)

    await typeLine('.', 180)

    /*
     * Give the modem a moment to scream.
     */
    await wait(2200)

    stopDialup()

    await wait(400)

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