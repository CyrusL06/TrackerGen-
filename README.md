# TrackerGen

> A full-stack JavaScript application built with React and Node.js — featuring a RESTful API backend and deployed live on Cloudflare Pages.

🔗 **Live Demo:** [https://trackergen30.pages.dev/]
   **Server Demo:** [https://trackergen.onrender.com]

---

## Overview

TrackerGen is a production-deployed web application that demonstrates end-to-end ownership of a modern full-stack system — from REST API design on the server, to a dynamic React frontend, to edge deployment via Cloudflare Pages.

The project was designed with architecture first: the `architecture.drawio` diagram included in the repo reflects the deliberate system design decisions made before writing any code.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                  │
│              React · JavaScript · TailwindCSS       │
│              Deployed: Cloudflare Pages             │
└────────────────────┬────────────────────────────────┘
                     │  REST API (HTTP/JSON)
┌────────────────────▼────────────────────────────────┐
│                  Server (API Layer)                  │
│                 Node.js · Express                    │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                   Data Layer                         │
└─────────────────────────────────────────────────────┘
```

The full architecture diagram is available in [`architecture.drawio`](./architecture.drawio) — open it with [draw.io](https://app.diagrams.net/) to explore component relationships.

**Key design decisions:**
- **Separation of concerns** — client and server live independently under `/client` and `/server`, with clearly defined REST API boundaries between them
- **Stateless REST API** — the server exposes clean HTTP endpoints, making it independently testable and easy to scale
- **Edge deployment** — the React client is deployed to Cloudflare Pages for low-latency global delivery
- **Component-driven UI** — the frontend is built with reusable React components, keeping UI logic modular and maintainable

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, CSS |
| Backend | Node.js, Express |
| API Style | REST (JSON over HTTP) |
| Deployment | Cloudflare Pages |
| Architecture Diagram | draw.io (`.drawio`) |

---

## Project Structure

```
TrackerGen-/
├── client/              # React frontend application
├── server/              # Node.js REST API server
├── architecture.drawio  # System architecture diagram
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/CyrusL06/TrackerGen-.git
cd TrackerGen-

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Running Locally

```bash
# Start the server (from /server)
npm start

# In a separate terminal, start the client (from /client)
npm start
```

The React app will be available at `http://localhost:3000` and the Node.js API at `http://localhost:5000` (or as configured in your environment).

---

## Deployment

The client is deployed on **Cloudflare Pages**, leveraging edge caching and global CDN distribution for fast load times regardless of location.

🔗 Live at: **[trackergen2.pages.dev](https://trackergen2.pages.dev)**

---

## Design Highlights

- **Architecture-first approach** — designed the full system diagram before writing any code, mapping out client/server responsibilities and data flow up front
- **Clean REST API design** — endpoints follow REST conventions with predictable routes and JSON responses, making the API easy to consume and extend
- **Decoupled frontend and backend** — the React client and Node.js server are fully independent; either can be swapped or scaled without touching the other
- **Edge-first deployment** — Cloudflare Pages ensures static assets are served from the nearest edge node globally

---

## Author

**Cyrus Lorenzo**
- GitHub: [@CyrusL06](https://github.com/CyrusL06)
- Portfolio: [cyruslorenzo.com](https://cyruslorenzo.com)

---

*"Coding to create systems."*
