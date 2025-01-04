import './index.css'
// @deno-types="@types/react"
import { StrictMode } from 'react'
// @deno-types="@types/react-dom/client"
import { createRoot } from 'react-dom/client'
import Game from "./Game.tsx";

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Game />
  </StrictMode>,
)
