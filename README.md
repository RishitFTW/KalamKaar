# 🎨 KalamKaar

KalamKaar is a both solo and collaborative canvas app built with Next.js, Express.js, Socket.io, Turborepo, and TypeScript. It supports both solo and collaborative drawing, providing a seamless real-time canvas for users to create and share ideas together.


![Notify](https://github.com/user-attachments/assets/c4a8010b-7ac2-4f73-8cac-3fac3686c100)
---
## ✨ Features

- **🖌️ Real-Time Canvas** – Draw, sketch, and brainstorm with an intuitive interface.
- **🤝 Collaborative Mode** – Multiple users can join and work together instantly via Socket.io.
- **⚡ Instant Sync** – Changes are updated across all participants in real time.
- **📦 Scalable Architecture** – Powered by Turborepo for efficient monorepo management.
- **🛠️ Modern Stack** – Built with Next.js frontend and Express.js backend for high performance.
- **🧠 Undo/Redo** - Works in both solo and collaborative sessions
- **👤 Solo Mode** – Use it individually for personal drawings and idea capture.
- **🖼️ Panning & Zooming** – Navigate large canvases smoothly with intuitive pan and zoom controls.
- **🎯 Real-Time Shape Dragging** – Move and reposition shapes instantly with live synchronization across all users.


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