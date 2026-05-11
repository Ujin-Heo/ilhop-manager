import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // TEMPORARY: Login redirect disabled
  // const token = request.cookies.get('admin_session')?.value

  // 관리자 경로에 접근하는데 토큰이 없으면 로그인 페이지로 리디렉트함
  // 단, /admin/login 엔드포인트는 제외해야 할 수도 있지만, 여기서는 프론트엔드 경로를 처리함.
  // if (request.nextUrl.pathname.startsWith('/admin')) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/login', request.url))
  //   }
  // }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
