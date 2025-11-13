import React from 'react'
import { Editor } from './components/Editor'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Editor />
  </React.StrictMode>
)
