import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// react-dom: manipulates website itself
// root: element where react inserts itself into
// createRoot expects html element used to instantiate: in this case, root
// .render w/ tsx object, but can be any other tsx too
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
