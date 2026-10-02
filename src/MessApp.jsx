import {
  useEffect,
  useRef,
  useState,
} from 'react'

import FileBrowser from './FileBrowser.jsx'
import { useTruthSequence } from './TruthSequence.jsx'

const extensions = [
  'tmp',
  'bak',
  'old',
  'dat',
  'log',
  'txt',

  'cfg',
  'conf',
  'cache',
  'zip',
  'tar',
  'gz',

  'json',
  'xml',
  'csv',
  'md',
  'java',
  'js',

  'css',
  'html',
  'pdf',
  'docx',
  'odt',
  'bin',

  'obj',
  'class',
  'jar',
  'swp',
  'lock',
  'dump',

  'core',
  'final',
  'final2',
  'new',
  'newer',
  'fixed',

  'fixed2',
  'ignore',
  'misc',
  'idk',
  'use_this_one',
]

const clutter = extensions.map((extension, index) => ({
  id: `clutter-${index + 1}`,
  name: `clutter.${extension}`,
  type: 'file',
  restricted: true,
}))

export default function MessApp() {
  const { startTruthSequence } = useTruthSequence()
  const [sourceRevealed, setSourceRevealed] =
    useState(false)

  const [smoking, setSmoking] =
    useState(false)

  const revealTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(
          revealTimerRef.current
        )
      }
    }
  }, [])

  function revealSource() {
    if (smoking || sourceRevealed) {
      return
    }

    const smokeSound = new Audio(
      `${import.meta.env.BASE_URL}audio/smoke-puff.mp3`
    )

    smokeSound.play().catch(() => {
      // No sound yet. That's fine.
    })

    setSmoking(true)

    revealTimerRef.current =
      window.setTimeout(() => {
        setSmoking(false)
        setSourceRevealed(true)
      }, 750)
  }

  const finalItem = sourceRevealed
    ? {
      id: 'src',
      name: 'src',
      type: 'folder',
      icon: '📁',

      children: [
        {
          id: 'truth',
          name: 'truth.exe',
          type: 'file',
          icon: '⚙️',

          onOpen: startTruthSequence,
        },
      ],
    }
    : {
      id: 'mirrors',
      name: 'mirrors',
      type: 'file',
      icon: '🪞',

      onOpen: revealSource,

      className:
        smoking
          ? 'is-smoking'
          : '',
    }

  const MESS = {
    id: 'mess',
    name: 'mess',
    type: 'folder',

    children: [
      ...clutter,
      finalItem,
    ],
  }

  return (
    <FileBrowser root={MESS} />
  )
}