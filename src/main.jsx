import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'
import { SystemErrorProvider } from './SystemError.jsx'
import { TruthSequenceProvider } from './TruthSequence.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SystemErrorProvider>
      <TruthSequenceProvider>
        <App />
      </TruthSequenceProvider>
    </SystemErrorProvider>
  </StrictMode>,
)