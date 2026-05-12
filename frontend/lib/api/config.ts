const isServer = typeof window === 'undefined';

// 서버 환경(예: Server Components)에서는 절대 경로가 필요하고,
// 클라이언트 환경(예: 브라우저)에서는 Next.js rewrite를 타도록 '/api'를 사용합니다.
export const BASE_URL = isServer
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
  : '/api';
