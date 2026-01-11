# iDLink — ID issuance & tracking ⚡

A complete project for issuing and tracking institutional ID cards. This repository contains two main parts:

- `idlink-ui-kit/` — React + TypeScript UI built with Vite
- `backend/` — Express backend with file uploads and MySQL

---

## Quick Start

Prerequisites
- Node.js v16+ and npm
- MySQL server (for backend database)

Clone and run locally:

```bash
git clone <REPO_URL>
cd iDLink

# Start the UI
cd idlink-ui-kit
npm install
npm run dev            # default: http://localhost:8080

# In a second terminal, start the backend
cd ../backend
npm install
# create backend/.env (see .env.example)
npm start              # default: http://localhost:5000
```

---

## Environment (.env) example (backend)

Create `backend/.env` with at least:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_db_password
DB_NAME=idlink_db
# Optional: SMTP for email notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your_smtp_password
FROM_EMAIL=notify@example.com
NODE_ENV=development
```

> The backend will create an Ethereal test account automatically in non-production mode if SMTP vars are not provided (useful for development).

---

## Features

Backend
- User auth: register & login (bcrypt hashed passwords)
- Application lifecycle: submit, revalidate, update status, delete
- File uploads: photos, signatures, and CORs (served at `/uploads`)
- Email notifications via SMTP or Ethereal test account
- Useful endpoints: `/api/applications`, `/api/users/count`, `/api/mailer-status`, `/`

UI
- Responsive React + TypeScript pages for students, staff, and admins
- Pages: Apply For ID, Track Status, Review Application, Register/Login, Dashboards
- Reusable UI components and utilities

---

## Importance

iDLink centralizes ID requests and processing, improving traceability, reducing paperwork, and speeding up ID issuance workflows for institutions.

---

## Deploying the UI to Vercel

- Import the GitHub repository in Vercel
- Set Root Directory to `idlink-ui-kit` (monorepo)
- Build Command: `npm run build`  Output Directory: `dist`
- Add `VITE_API_URL` environment variable pointing to your backend

---

