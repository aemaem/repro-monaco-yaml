import React from 'react'
import {createRoot} from 'react-dom/client'
import {Editor} from "./components/Editor";

const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Editor/>
    </React.StrictMode>
)
