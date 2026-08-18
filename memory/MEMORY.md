# Project Memory

## Business Portal Summary
- Stack: MERN (React frontend, Express + MongoDB backend)
- Core modules: Dashboard, Finance, Investors, Reports, Settings
- Auth: JWT login with roles (admin, manager, viewer)
- Privileges:
  - admin: full access, settings + users management
  - manager: write access to finance/investors
  - viewer: read-only business data

## Key Features Implemented
- Transactions CRUD with summaries
- Investors CRUD with ownership/capital summary
- Reports with charting and PDF export
- Settings for currency and bank setup
- Filterable/searchable dropdowns
- Profile editing for current user

## Deployment Notes
- VPS deployment pattern: rsync + docker compose
- Running target used: `82.112.254.227`
- Current app endpoint: `http://82.112.254.227:7704/`

## Follow-up Reminders
- Configure domain + nginx + SSL
- Rotate default admin password immediately in production
- Keep `JWT_SECRET` and DB credentials secure
