import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import { hydrateRoot } from 'react-dom/client'
// Download React RouterDom
import { BrowserRouter} from 'react-router-dom'

import './index.css'
import App from './App.tsx'

// createRoot(document.getElementById('root')).render(
const rootEl = document.getElementById("root");


  if(!rootEl){
    throw new Error("Root element not found");
  }

  //Replaces this
  hydrateRoot(
    rootEl,
    <BrowserRouter>
          <App />
    </BrowserRouter>
  )
  // <StrictMode>
  //   <App />
  // </StrictMode>
// )
