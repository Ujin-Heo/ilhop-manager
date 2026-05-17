# 🍺 ilhop-manager

> **A full-stack order management web application designed to prevent order confusion at offline one-day pub events and efficiently manage real-time payments and serving.**

🇰🇷 **[한국어 버전 보기 (Korean Version)](README.md)**

[![Frontend - Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Backend - FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Database - PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Deployment - Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![Deployment - Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=flat-square&logo=railway)](https://railway.app/)

Ilhop Manager was developed to solve order omissions, payment confirmation delays, and serving confusion that occur at large-scale one-day pub events. It supports seamless communication between cashiers, servers, and customers through real-time status synchronization using WebSockets.

### ‼️ [MUST READ] [Detailed Website Usage Guide (Korean)](https://blog.naver.com/hujin2005/224288068916) ‼️

> **Highly recommended for those who wish to use or modify this website. It covers:**
>
> 1. How to use the website
> 2. How to deploy the website
> 3. How to set up automated payment confirmation
> 4. Troubleshooting deployment issues

---

### 📸 Website Screenshots (실제 웹사이트 화면 사진)

<div align="center">
  <table border="0">
    <tr>
      <td align="center" width="22%"><img src="docs/screenshots/1.jpg" width="100%" /></td>
      <td align="center" width="22%"><img src="docs/screenshots/2.jpg" width="100%" /></td>
      <td align="center" width="22%"><img src="docs/screenshots/3.jpg" width="100%" /></td>
      <td align="center" width="30%">
        <img src="docs/screenshots/4.jpg" width="100%" />
        <br><br>
        <img src="docs/screenshots/5.jpg" width="100%" />
      </td>
    </tr>
  </table>
</div>

---

## ✨ Key Features

### 📱 Customer Ordering System

- **Table-specific Access**: Scan a QR code to immediately access a session assigned with a table number without a separate login.
- **Digital Menu & Cart**: Browse menus with images and descriptions, add items to the cart, and order all at once.
- **Real-time Order Status**: Check the cooking and serving status of ordered menus in real-time.

### 💰 Integrated Management Dashboard for Cashiers

- **Real-time Table Map**: Visualize the status of all tables in the store (in use, order pending, serving in progress) with a visual layout.
- **Consolidated Order List**: List all incoming orders from all tables chronologically and immediately identify unpaid items.
- **Automated Payment Processing**: Integrate with financial app notifications (e.g., Toss) to approve orders with a single "confirm deposit" button.

### 🏃 Dedicated Panel for Hall Servers

- **Mobile-Optimized UX**: Provides a mobile web interface that is easy to operate with one hand.
- **Serving Queue Management**: Check menus waiting to be served and table numbers, and immediately mark them as "served" to reflect in the entire system.

---

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (OKLCH Color System)
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: React Context API & Hooks

### Backend

- **Framework**: FastAPI (Python 3.12+)
- **ORM**: SQLAlchemy 2.0 (Async)
- **Database**: PostgreSQL (Alembic for migrations)
- **Validation**: Pydantic v2

### Infra & Dev Tools

- **Deployment**: Vercel (Frontend), Railway (Backend & DB)
- **API Spec**: OpenAPI (REST), AsyncAPI 3.0 (WebSocket)
- **Package Manager**: Bun (Frontend), uv (Backend)

---

## 📂 Directory Structure

```text
ilhop-manager/
├── backend/            # FastAPI backend application
│   ├── src/            # Source code (routes, models, schemas, crud)
│   ├── migrations/     # Alembic DB migration files
│   ├── pyproject.toml  # uv-based dependency management
│   └── main.py         # Application entry point
├── frontend/           # Next.js frontend application
│   ├── app/            # App Router based page structure
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility and API communication logic
│   └── package.json    # npm/bun dependency management
├── docs/               # API specifications and design documents
│   ├── OpenAPI.yaml    # REST API specification
│   └── AsyncAPI.yaml   # WebSocket specification
└── GEMINI.md           # Project development guidelines
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (Bun recommended)
- Python 3.12+
- PostgreSQL 15+
- [uv](https://github.com/astral-sh/uv) (Python package manager)

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/ilhop-manager.git
cd ilhop-manager
```

### 2. Backend Setup and Execution

```bash
cd backend
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv sync
# Apply DB migrations
uv run alembic upgrade head
# Run server
uv run uvicorn src.app:app --reload
```

### 3. Frontend Setup and Execution

```bash
cd frontend
bun install  # or npm install
bun dev      # or npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in each directory and configure it based on the following.

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/ilhop_db
SECRET_KEY=your_super_secret_key
ADMIN_PASSWORD=admin_password_for_cashier
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

---

## 📄 Documentation

Detailed API specifications for the project can be found in the following files:

- **REST API**: `docs/OpenAPI.yaml` (Accessible via Swagger UI, etc.)
- **WebSocket**: `docs/AsyncAPI.yaml` (Real-time communication event specifications)
- **DB Schema**: `docs/DB_schema.sql`

---

## 💡 Terms of Use & Contribution

1. **Free Use and Modification**: The source code and website in this repository are free for anyone to use and modify.
2. **Non-Commercial Use Only & Attribution**:
   - Use for commercial purposes is **prohibited**.
   - When modifying or using this project, you must **clearly state the original author and source** within the code or the final output (website).
3. **Contribution Policy**: Currently, the author is unable to review Pull Requests. Therefore, we are not accepting direct contributions to this repository. However, anyone is free to **Fork**, modify, and redistribute the project as long as the terms above are met.
4. **Feedback**: If you use or modify this repository for your event, I would greatly appreciate hearing your feedback! Please send your stories to [hujin2005@korea.ac.kr](mailto:hujin2005@korea.ac.kr).

---

## ⚖️ License

This project is licensed under a **Customized MIT License (Non-Commercial Use Only)**. See the [LICENSE](LICENSE) file for details.
