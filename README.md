# supply-integrity-track
supply chain integrity tracking based on blockchain technology

Quick start (development)

- Start the backend (from repository root):

```bash
cd backend
npm install
npm run dev
```

- Start the frontend (in a separate terminal):

```bash
cd supplied-main
npm install
npm run dev
```

Environment files

- Backend: copy `backend/.env.example` → `backend/.env` and fill values.
- Frontend: copy `supplied-main/.env.example` → `supplied-main/.env` and adjust `VITE_API_BASE_URL`.

Notes

- The backend exposes API endpoints at `http://localhost:5000/api` by default.
- The frontend reads `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api`).
- The backend will use an in-memory Firestore fallback when Firebase credentials are not provided.
- For blockchain features, set `RPC_URL` in the backend or run a local Hardhat node.

