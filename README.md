# 🍺 ilhop-manager (일홉 매니저)

> **오프라인 일일호프 행사의 주문 혼선을 방지하고 실시간 결제 및 서빙을 효율적으로 관리하는 풀스택 주문 관리 웹 애플리케이션**

[![Frontend - Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Backend - FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Database - PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Deployment - Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![Deployment - Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=flat-square&logo=railway)](https://railway.app/)

**일홉 매니저**는 일일호프 행사를 편리하게 진행하기 위해 개발되었습니다. 이 웹사이트를 사용하면 손님은 간편하게 자리에서 QR코드로 웹사이트에 접속하여 주문하고, 캐셔는 일일이 은행 앱의 입금 내역을 확인할 필요 없이 자동으로 손님의 입금을 확인할 수 있습니다.

일홉 매니저는 WebSocket을 통한 실시간 상태 동기화로 캐셔, 홀서버, 손님 간의 원활한 커뮤니케이션을 지원하여 일일호프 현장에서 발생하는 주문 누락, 입금 확인 지연, 서빙 혼선을 해결해줍니다.

🇺🇸 **[English Version Available (README_EN.md)](README_EN.md)**

### ‼️ [필독] [웹사이트 사용 상세 가이드](https://blog.naver.com/hujin2005/224288068916) ‼️

> **이 웹사이트를 수정/사용하려는 분들은 꼭 읽어보시기를 권장합니다. 다음의 내용을 담고 있습니다.**
>
> 1. 웹사이트 사용 방법
> 2. 웹사이트 배포 방법
> 3. 자동 결제 확인 기능 설정 방법
> 4. 배포 중 문제 해결

---

### 📸 실제 웹사이트 화면 사진 (Website Screenshots)

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

## ✨ 주요 기능 (Key Features)

### 📱 손님용 주문 시스템

- **테이블별 고유 접속**: QR코드 스캔을 통해 별도의 로그인 없이 테이블 번호가 할당된 세션으로 즉시 접속합니다.
- **디지털 메뉴판 & 장바구니**: 이미지와 설명을 확인하며 원하는 메뉴를 장바구니에 담고 한꺼번에 주문할 수 있습니다.
- **실시간 주문 상태**: 내가 주문한 메뉴의 조리 및 서빙 상태를 실시간으로 확인합니다.

### 💰 캐셔용 통합 관리 대시보드

- **실시간 테이블 맵**: 매장 전체의 테이블 상태(사용 중, 주문 대기, 서빙 중)를 시각적인 레이아웃으로 파악합니다.
- **통합 주문 리스트**: 모든 테이블에서 들어오는 주문을 시간순으로 나열하며, 미결제 항목을 즉시 확인합니다.
- **입금 처리 자동화**: 토스 등 금융 앱 알림과 연동하여 실시간 입금 확인 버튼 하나로 주문을 승인 처리합니다.

### 🏃 홀서버 전용 패널

- **모바일 최적화 UX**: 한 손으로 조작하기 쉬운 모바일 웹 인터페이스를 제공합니다.
- **서빙 큐 관리**: 서빙 대기 중인 메뉴와 테이블 번호를 확인하고, 서빙 완료 시 즉시 체크하여 전체 시스템에 반영합니다.

---

## 🛠 기술 스택 (Tech Stack)

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

## 📂 디렉토리 구조 (Directory Structure)

```text
ilhop-manager/
├── backend/            # FastAPI 백엔드 애플리케이션
│   ├── src/            # 소스 코드 (routes, models, schemas, crud)
│   ├── migrations/     # Alembic DB 마이그레이션 파일
│   ├── pyproject.toml  # uv 기반 의존성 관리
│   └── main.py         # 애플리케이션 진입점
├── frontend/           # Next.js 프론트엔드 애플리케이션
│   ├── app/            # App Router 기반 페이지 구성
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   ├── lib/            # 유틸리티 및 API 통신 로직
│   └── package.json    # npm/bun 의존성 관리
├── docs/               # API 명세서 및 설계 문서
│   ├── OpenAPI.yaml    # REST API 명세
│   └── AsyncAPI.yaml   # WebSocket 명세
└── GEMINI.md           # 프로젝트 개발 가이드라인
```

---

## 🚀 시작 가이드 (Getting Started)

### 필수 요구사항

- Node.js 20+ (Bun 권장)
- Python 3.12+
- PostgreSQL 15+
- [uv](https://github.com/astral-sh/uv) (Python 패키지 매니저)

### 1. 레포지토리 클론

```bash
git clone https://github.com/your-repo/ilhop-manager.git
cd ilhop-manager
```

### 2. 백엔드 설정 및 실행

```bash
cd backend
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv sync
# DB 마이그레이션 적용
uv run alembic upgrade head
# 서버 실행
uv run uvicorn src.app:app --reload
```

### 3. 프론트엔드 설정 및 실행

```bash
cd frontend
bun install  # 또는 npm install
bun dev      # 또는 npm run dev
```

---

## ⚙️ 환경 변수 설정 (Environment Variables)

각 디렉토리에 `.env` 파일을 생성하고 아래 내용을 참고하여 설정합니다.

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

## 📄 API 및 설계 문서 (Documentation)

프로젝트의 상세 API 명세는 다음 파일에서 확인할 수 있습니다.

- **REST API**: `docs/OpenAPI.yaml` (Swagger UI 등에서 확인 가능)
- **WebSocket**: `docs/AsyncAPI.yaml` (실시간 통신 이벤트 명세)
- **데이터베이스 구조**: `docs/DB_schema.sql`

---

## 💡 이용 약관 및 기여 안내 (Terms of Use & Contribution)

1. **자유로운 사용 및 수정**: 이 레포지토리의 소스 코드와 웹사이트는 누구나 무료로 사용하고 수정할 수 있습니다.
2. **비영리적 목적 한정 & 출처 표기**:
   - 영리적 목적(상업적 이용)을 위한 사용은 **불가능**합니다.
   - 수정 및 사용 시에는 반드시 코드 내부 또는 최종 결과물(웹사이트) 내에 **원작자와 출처를 명시**해야 합니다.
3. **기여(Contribution) 안내**: 현재 원작자가 Pull Request를 확인하고 검토할 수 없는 상황입니다. 따라서 이 레포지토리에 직접적인 기여는 받고 있지 않지만, 위의 약관을 준수한다면 누구나 자유롭게 **Fork**하여 수정 및 배포가 가능합니다.
4. **후기 공유**: 혹시 이 레포지토리를 활용하여 행사를 진행하시거나 수정하여 사용하신다면, [hujin2005@korea.ac.kr](mailto:hujin2005@korea.ac.kr)로 후기를 알려주세요! 원작자에게 큰 힘이 됩니다.

---

## ⚖️ License

이 프로젝트는 **커스텀 MIT 라이선스(비영리 목적 한정)**에 따라 라이선스가 부과됩니다. 상세 내용은 [LICENSE](LICENSE) 파일을 확인해 주세요.
