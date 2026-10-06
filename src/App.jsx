import { useEffect, useState } from 'react'

import DesktopShell from './DesktopShell.jsx'
import NewtonShell from './NewtonShell.jsx'

function getMobileLayout() {
  return window.matchMedia('(max-width: 600px)').matches
}

export default function App() {
  const [mobile, setMobile] = useState(getMobileLayout)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)')

    function handleChange(event) {
      setMobile(event.matches)
    }

    query.addEventListener('change', handleChange)

    return () => {
      query.removeEventListener('change', handleChange)
    }
  }, [])

  return mobile
    ? <NewtonShell />
    : <DesktopShell />
}