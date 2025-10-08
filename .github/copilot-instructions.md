# Copilot / AI Agent Instructions for e-placement-hub

This file gives targeted, actionable guidance to AI coding agents (Copilot-style) working on the e-placement-hub repository.

Keep these constraints in mind:
- Preserve existing APIs (backend routes under /api/*). Avoid changing route URLs or request/response shapes unless the change is small and backward-compatible and explicitly noted in the PR description.
- Only add dependencies when necessary. Prefer built-in Node/Express utilities and existing project libraries (mongoose, axios, bcryptjs). Add new packages with a short justification in the PR description.
- Follow the project's folder conventions: backend (Express + MongoDB) and frontend (Vite + React + Tailwind). Backend is CommonJS (require/module.exports); frontend uses ES modules.

What the project is (big picture)
- Monorepo-like layout: a Node/Express backend in `backend/` (MongoDB + Mongoose models, auth with JWT) and a React frontend in `frontend/` (Vite, Tailwind, React Router). A small Python ML microservice runs separately on port 8000 and is called from `backend/routes/driveRoutes.js`.
- Key flows: user auth (register/login/forgot-password/OTP), student masterlist upload (Excel parsing, xlsx), drive creation & applicant tracking, dashboard stats aggregation.

Quick reference to important files
- backend/index.js — Express entrypoint; routes mounted at `/api/users`, `/api/students`, `/api/drives`, `/api/dashboard`.
- backend/package.json — npm scripts: `npm run dev` starts nodemon (index.js).
- backend/routes/*.js — Route handlers and examples of patterns to follow.
  - `userRoutes.js` — Registration, login, OTP email flow (nodemailer). Example: `POST /api/users/forgot-password` generates hashed OTP stored in `otp` collection and emails it.
  - `studentRoutes.js` — XLSX file upload using `multer` + `xlsx`. Example: `POST /api/students/upload` expects `multipart/form-data` with `masterlist` file field.
  - `driveRoutes.js` — Drive CRUD, applicant counts (uses Student model to count by nested `placementActivity.company`), and ML predict endpoint which calls `http://localhost:8000/predict`.
  - `dashboardRoutes.js` — Aggregation helpers (counts, placement rate). These endpoints are used by frontend dashboard components.
- backend/models/*.js — Mongoose schemas for User, Student, Drive, Otp. Note: `placementActivity` stores per-drive objects and `rounds` has many named round keys.
- backend/ml-service/ml_predictor.py — Flask app that returns a placement probability; backend expects it at port 8000.
- frontend/package.json — `npm run dev` runs Vite; port is typically 5173.

Important project-specific patterns and conventions
- Auth: Backend uses JWTs signed with `process.env.JWT_SECRET`. Tokens are returned to clients (frontend expects `{ token }`). When creating or adjusting auth flows, preserve token payload shape: `{ user: { id, name, role } }`.
- OTPs: OTP documents auto-expire (Mongoose `expires: 300`) and are hashed with bcrypt before saving. `verify-otp` compares with bcrypt.compare and then issues a temporary JWT (`expiresIn: '10m'`).
- Student masterlist upload: Excel column names in the existing implementation include `Roll Number`, `Name`, `Moodle ID`, `CGPA`, `Branch`, `Email`, `Phone`, `Companies`. Use the same column names for compatibility when adding new parsing logic.
- Drive-applicant linking: Students have `placementActivity` array with `company` field equal to `Drive.companyName`. Drive endpoints count applicants by querying `{'placementActivity.company': drive.companyName}` - keep this when altering drive or student schemas.
- Rounds model: Round keys are string names (e.g., `aptitude`, `technical`, `finalStatus`). Drive applicant updates expect `roundName` to be a key in the `rounds` object; validate the key before updating.

Dev & debug workflows (how to run things locally)
- Backend:
  - cd backend
  - npm install
  - Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `PORT`.
  - npm run dev (starts nodemon -> index.js). Logs: "MongoDB connected successfully!" and "Server is running on port <PORT>".
  - ML service must be started separately (Python): `python ml-service/ml_predictor.py` (Flask default). Backend drive predict endpoint expects ML service at `http://localhost:8000/predict`.
- Frontend:
  - cd frontend
  - npm install
  - npm run dev (Vite dev server, default: http://localhost:5173)

Integration & testing notes
- ML dependency: The backend tries to call `http://localhost:8000/predict`. If the ML microservice isn't running, requests to `/api/drives/predict` will fail with ECONNREFUSED; code already maps that into a 503 with helpful message. When writing tests or adding features that use prediction, stub or mock `axios.post`.
- Email sending: `userRoutes.js` uses nodemailer with credentials from `.env`. When running tests locally, either provide test email creds or mock nodemailer (recommended).
- Excel upload: `studentRoutes.js` stores files in memory via `multer.memoryStorage()` and parses via `xlsx.read(buffer, { type: 'buffer' })`.

Code style & small conventions
- Backend uses CommonJS (`require` / `module.exports`) and async/await with try/catch. Keep that style rather than shifting to ESM unless doing a repo-wide change.
- Use Mongoose `findOneAndUpdate` with `upsert: true, new: true` for idempotent create-or-update logic (the student upload uses this pattern).
- Error handling: route handlers generally `console.error` the error and return a generic message like "Server Error" or specific 4xx for validation; follow existing patterns.

When to open a PR vs make a small commit
- Small commits permitted for UI copy, small bugfixes, or improving error messages.
- For any change that alters API shapes, environment variables, adds external services, or adds dependencies, open a PR and explain the change, migration steps, and any required env updates.

Examples to reference in PRs or edits
- Use `driveRoutes.js` applicant-count method as a template when adding aggregated counts:
  - maps over Drive documents and runs `Student.countDocuments({ 'placementActivity.company': drive.companyName })` concurrently with `Promise.all`.
- Use `userRoutes.js` forgot-password flow when implementing new token-based temporary flows (generate hashed OTP, save to `Otp` collection with TTL, email, verify with bcrypt, issue short-lived JWT).
- For file uploads, follow `studentRoutes.js`'s `upload.single('masterlist')` pattern.

What NOT to change without discussion
- The `placementActivity.company` string matching convention (used across multiple routes and the frontend). Breaking this requires migration.
- JWT token payload shape and expiry policies unless coordinating with frontend.
- The ML microservice contract: POST /predict returns JSON with `prediction_score` and `predicted_class`.

If anything is unclear or you need an environment variable, ask the repo owner for:
- `.env.example` contents if missing (we expect MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS, PORT)
- Whether ML microservice should be containerized or integrated into the backend in future work.

Request feedback
- After applying changes, leave a short summary in PR description identifying touched files and why. Ask reviewers to verify auth and upload endpoints manually (these are integration-sensitive).

End of instructions.
