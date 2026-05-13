const isServer = typeof window === 'undefined';

// process.env.NEXT_PUBLIC_API_URL should be something like 'https://backend.railway.app' or 'http://localhost:8000'
// trailing slash를 제거하여 URL 조립 시 중복 슬래시 방지
export const API_HOST = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

// 서버 환경(예: Server Components)에서는 절대 경로가 필요하고,
// 클라이언트 환경(예: 브라우저)에서는 Next.js rewrite를 타도록 '/api'를 사용합니다.
export const BASE_URL = isServer
  ? API_HOST
  : '/api';

// 웹소켓은 Next.js rewrite가 지원되지 않으므로 항상 절대 경로를 사용합니다.
export const WS_BASE_URL = API_HOST.replace(/^http/, 'ws');
