import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {ClerkProvider} from "@clerk/react"


import "./index.css";
import App from "./App.jsx";

const rootEl = document.getElementById("root");
const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!rootEl) {
  throw new Error("Root element not found");
} else if (!key) throw new Error("Missing Clerk publishable key")



createRoot(rootEl).render(
      <BrowserRouter>
          <ClerkProvider publishableKey={key}>
                <App />
          </ClerkProvider>
    </BrowserRouter>
);
