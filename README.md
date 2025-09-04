# 🎨 KalamKaar

KalamKaar is a both solo and collaborative canvas app built with Next.js, Express.js, Socket.io, Turborepo, and TypeScript. It supports both solo and collaborative drawing, providing a seamless real-time canvas for users to create and share ideas together.


---

## ✨ Features

- **🖌️ Real-Time Canvas** – Draw, sketch, and brainstorm with an intuitive interface.
- **🤝 Collaborative Mode** – Multiple users can join and work together instantly via Socket.io.
- **⚡ Instant Sync** – Changes are updated across all participants in real time.
- **📦 Scalable Architecture** – Powered by Turborepo for efficient monorepo management.
- **🛠️ Modern Stack** – Built with Next.js frontend and Express.js backend for high performance.
- **🧠 Undo/Redo** - Works in both solo and collaborative sessions
- **👤 Solo Mode** – Use it individually for personal drawings and idea capture.


---


# 🛠️ Tech Stack

| Layer         | Tech                                    |
|---------------|-----------------------------------------|
| Frontend      | Next.js (App Router), Canvas API        |
| Realtime      | WebSocket (Socket.IO)                   |
| Backend       | Express.js (Node.js)                    |
| Architecture  | Turborepo (monorepo setup)              |
| Auth          | JWT                                     |
| Database      | PostgreSQL + Prisma ORM                 |


---


# 📂 Folder Structure
```

KalamKaar/
├── apps/
│   ├── http-server/  # Backend(Express.js)
│   └── web/          # Frontend(Next.js)
│   └── ws-server/    # Socket.io server
├── packages/         # DB and Shared configs
├── turbo.json        # Turborepo configuration
└── README.md
```