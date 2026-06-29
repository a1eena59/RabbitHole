# 🕳️ RabbitHole

> Turn your browsing sessions into an interactive map of your curiosity.

RabbitHole is a browser extension + web app that records your browsing session and visualizes it as an interactive graph. Instead of a long browser history, it shows how one page led to another, groups related pages into topics, and lets you replay your entire internet journey.

Whether you were researching, learning, or accidentally spending two hours on Wikipedia, RabbitHole helps you understand how you got there.

---

## ✨ Features

- 🌐 Record browsing sessions with a browser extension
- 🕸️ Interactive graph visualization
- 🧠 Semantic clustering of related pages using embeddings
- ▶️ Replay your browsing journey
- 📊 Session insights and analytics
- ⚡ Smooth animations and modern UI

---

## 🏗️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Shadcn UI
- Framer Motion
- Cytoscape.js

### Browser Extension
- WXT
- Chrome Manifest V3
- TypeScript
- Chrome Extension APIs

### Backend
- FastAPI
- Python
- SQLAlchemy
- PostgreSQL (Neon)

### AI / Processing
- sentence-transformers
- scikit-learn
- NumPy

---

## 📁 Project Structure

```
rabbit-hole/
│
├── backend/
│   ├── app/
│   ├── migrations/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   └── public/
│
├── extension/
│   ├── entrypoints/
│   ├── services/
│   ├── storage/
│   ├── types/
│   └── utils/
│
└── README.md
```

---

## 🚀 How it Works

1. Start recording from the browser extension.
2. Browse normally.
3. Stop the session.
4. The extension sends browsing events to the backend.
5. The backend generates embeddings and groups related pages into semantic clusters.
6. A graph is built from the browsing sequence.
7. Open the dashboard to replay and explore your session.

---


## 🛠️ Local Setup

### Clone

```bash
git clone https://github.com/yourusername/rabbit-hole.git

cd rabbit-hole
```

---

### Backend

```bash
cd backend

uv sync

uv run uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend

pnpm install

pnpm dev
```

---

### Extension

```bash
cd extension

pnpm install

pnpm dev
```

Load the generated extension into Chrome using **Developer Mode**.

---

## 🤝 Contributing

Contributions, suggestions, and feedback are always welcome!

Feel free to open an issue or submit a pull request.

---

## 📄 License

MIT License

---

Made with ☕ and a few too many browser tabs.
