# Sales Insight Automator

Sales Insight Automator is a production-oriented MERN stack application that ingests sales CSV or Excel files, generates an executive summary, and delivers that summary by email. The stack includes a React/Vite frontend, an Express backend, optional MongoDB logging, Swagger docs, Docker orchestration, and a GitHub Actions CI workflow.

## 1. Folder Structure

```text
mern-sales-insight-automator/
├── backend/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── eslint.config.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .github/workflows/ci.yml
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 2. Project Overview

The platform accepts `.csv` and `.xlsx` uploads, parses sales records into structured JSON, sends a trimmed dataset sample to an AI provider when configured, returns an executive summary to the client, and emails that summary through SMTP when configured. MongoDB stores upload metadata and processing status when available, with an in-memory fallback for review deployments.

## 3. Architecture Diagram

```text
[React SPA]
    |
    v
[Express API] ---> [MongoDB: upload_logs]
    |        \
    |         \--> [SMTP Provider]
    |
    \---------> [Gemini / OpenAI-Compatible API]
    |
    \---------> [Fallback summary + preview delivery]
```

## 4. Backend Code

Backend responsibilities:

- `POST /api/upload`: validates email and file, parses CSV/XLSX, calls the AI service when configured, falls back to a local summary when not configured, stores metadata in MongoDB when available, and returns the generated summary.
- `POST /api/send-email`: sends the summary through SMTP when configured, otherwise returns preview mode so the review flow still works.
- `GET /api/health`: returns service status, timestamp, and active fallback modes.
- `/api-docs`: exposes Swagger UI.

Backend implementation details:

- Security: `helmet`, CORS allowlist, request size control, upload MIME checks, Joi validation, and rate limiting.
- Parsing: `csv-parser` for CSV and `xlsx` for Excel.
- AI abstraction: supports `gemini` and `openai-compatible` providers through environment variables, with a deterministic local summary fallback.
- Persistence: `UploadLog` model stores `fileName`, `uploadTime`, `email`, `aiSummary`, and `status`, with in-memory storage when MongoDB is unavailable.

## 5. Frontend Code

Frontend responsibilities:

- Render a single-page upload experience with states for idle, uploading, processing, success, and error.
- Collect email and file input.
- Submit the upload to the backend via Axios.
- Trigger summary email dispatch after successful summary generation.
- Show a success page with summary preview and parsed dataset preview.

Key UI pages:

- `/`: upload form and processing state.
- `/success`: summary confirmation and preview.

## 6. Docker Files

Containers included:

- `backend/Dockerfile`: Node 22 Alpine image running the Express API on port `5000`.
- `frontend/Dockerfile`: Vite build stage plus Nginx runtime on port `80`.
- `docker-compose.yml`: boots `frontend`, `backend`, and `mongodb`.

### Docker run instructions

1. Copy `.env.example` to `.env` and fill in the AI and SMTP credentials.
2. Run:

```bash
docker compose up --build
```

3. Open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/health`
- Swagger docs: `http://localhost:5000/api-docs`

## 7. API Documentation

Swagger UI is available at:

```text
http://localhost:5000/api-docs
```

Endpoints:

- `GET /api/health`
- `POST /api/upload`
- `POST /api/send-email`

## 8. Setup Instructions

### Local development

1. Create the environment file:

```bash
cp .env.example .env
```

2. Install backend dependencies:

```bash
cd backend && npm install
```

3. Install frontend dependencies:

```bash
cd frontend && npm install
```

4. Start MongoDB locally or use Docker.

5. Start the backend:

```bash
cd backend && npm run dev
```

6. Start the frontend:

```bash
cd frontend && npm run dev
```

### Review deployment mode

If you only need a shareable demo for reviewers:

- Set `SKIP_DB=true` if you do not have MongoDB.
- Leave `VITE_API_BASE_URL` empty to use the deployed backend through the same site origin or set it to your hosted backend `/api` URL.
- If `AI_API_KEY` is not configured, the backend generates a local fallback summary.
- If SMTP credentials are not configured, the frontend shows a delivery preview instead of sending a real email.

## 9. CI/CD Pipeline

GitHub Actions workflow:

- Trigger: pull request to `main`
- Install dependencies separately for frontend and backend
- Run lint
- Run build validation
- Verify backend server startup in CI mode without database dependency

Workflow file:

- [`.github/workflows/ci.yml`](/e:/rabbit_ai/.github/workflows/ci.yml)

## 10. Security Notes

- File uploads are restricted to CSV and XLSX MIME types.
- Upload size is limited to `5 MB`.
- Input validation is enforced with Joi.
- Rate limiting protects API endpoints.
- Credentials are loaded from environment variables only.
- CORS is explicitly configured rather than left open.
- HTTP headers are hardened with Helmet.

## 11. Deployment Steps

### Render blueprint deployment

This repository now includes [`render.yaml`](/e:/rabbit_ai/render.yaml) for a one-service Render deployment:

1. Push this repository to GitHub.
2. In Render, click `New` -> `Blueprint`.
3. Select this repository and keep the default root `render.yaml`.
4. Render will create one web service that:
   - builds the React frontend,
   - starts the Express backend,
   - serves the frontend from the same public URL.
5. After deployment:
   - Frontend Deployed URL: `https://<your-service>.onrender.com`
   - Backend API URL: `https://<your-service>.onrender.com/api`

Optional production configuration:

- Add `AI_API_KEY` for real AI summaries instead of local fallback summaries.
- Add SMTP credentials for real email delivery instead of preview mode.
- Set `SKIP_DB=false` and provide `MONGODB_URI` if you want persistent MongoDB logging.

## 12. Environment Variables

See [`.env.example`](/e:/rabbit_ai/.env.example) for the full reference.

Important variables:

- `MONGODB_URI`
- `SKIP_DB`
- `CORS_ORIGIN`
- `AI_PROVIDER`
- `AI_API_URL`
- `AI_API_KEY`
- `AI_MODEL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `VITE_API_BASE_URL`
