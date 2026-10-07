import './TerminalApp.css'
import { useEffect, useRef, useState } from 'react'
import UbuntuFetch from './UbuntuFetch.jsx'

const WELCOME = [
  'Welcome to Jack’s instructor workstation.',
  'Type help for available commands.',
].join('\n')

const HELP = [
  'help          Show available commands',
  'about         About this workstation',
  'neofetch      Show the logo and workstation details',
  'date          Show the current date and time',
  'echo <text>   Repeat your text',
  'notes         Open the notes editor',
  'clear         Clear the terminal',
].join('\n')

export default function TerminalApp({
  onOpenNotes,
  visible,
  active,
}) {
  const [input, setInput] = useState('')

  const [entries, setEntries] = useState([
    {
      command: null,
      type: 'fetch',
      output: WELCOME,
    },
  ])

  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!visible) return

    const element = scrollRef.current
    if (!element) return

    // Keep the opening graphic visible on first load.
    // Once commands are entered, follow the prompt.
    if (entries.length > 1) {
      element.scrollTop = element.scrollHeight
    }
  }, [entries, visible])

  useEffect(() => {
    if (visible && active) {
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [visible, active])

  function focusInput(event) {
    // Leave the colour-swatch tooltips and other controls alone.
    if (event.target.closest('button, a')) return

    // Allow selecting and copying terminal output.
    if (window.getSelection()?.toString()) return

    inputRef.current?.focus({ preventScroll: true })
  }

  function runCommand(event) {
    event.preventDefault()

    const command = input.trim()
    if (!command) return

    setInput('')

    const [name] = command.split(/\s+/)
    const argument = command.slice(name.length).trimStart()

    let output = ''
    let type = 'text'

    switch (name.toLowerCase()) {
      case 'help':
        output = HELP
        break

      case 'about':
        output = [
          'Jack’s Workstation',
          'A React desktop for teaching, tools, and tinkering.',
          'This terminal controls the website, not your computer.',
        ].join('\n')
        break

      case 'neofetch':
        type = 'fetch'
        break

      case 'date':
        output = new Date().toLocaleString()
        break

      case 'echo':
        output = argument
        break

      case 'notes':
        onOpenNotes()
        output = 'Opened notes.txt in Emacs.'
        break

      case 'clear':
        setEntries([])
        return

      default:
        output = `${name}: command not found. Type help.`
    }

    setEntries(previous => [
      ...previous,
      {
        command,
        type,
        output,
      },
    ])
  }

  return (
    <div
      className="terminal-app"
      ref={scrollRef}
      onClick={focusInput}
    >
      <div className="terminal-history">
        {entries.map((entry, index) => (
          <div className="terminal-entry" key={index}>
            {entry.command !== null && (
              <div className="terminal-command">
                <span className="prompt-user">
                  jack@workstation
                </span>

                <span className="prompt-path">:~$ </span>

                <span>{entry.command}</span>
              </div>
            )}

            {entry.type === 'fetch' && <UbuntuFetch />}

            {entry.output && (
              <pre className="terminal-output">
                {entry.output}
              </pre>
            )}
          </div>
        ))}
      </div>

      <form
        className="terminal-prompt"
        onSubmit={runCommand}
      >
        <label htmlFor="terminal-command-input">
          <span className="prompt-user">
            jack@workstation
          </span>

          <span className="prompt-path">:~$ </span>
        </label>

        <input
          ref={inputRef}
          id="terminal-command-input"
          type="text"
          aria-label="Terminal command"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={input}
          onChange={event => setInput(event.target.value)}
        />
      </form>
    </div>
  )
}