import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// DLT_DISABLED: legacy DLT routes no longer exist. Redirect them to /dashboard.
// Allow everything else through (local-dev, auth handled client-side via nrtData).
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lowered = pathname.toLowerCase();
  if (
    lowered.startsWith('/dlt') ||
    lowered.startsWith('/template-group-list') ||
    lowered.startsWith('/template-group') ||
    lowered.startsWith('/dlt-template') ||
    lowered.startsWith('/report-by-template-group') ||
    lowered.startsWith('/summary-report-by-template-group')
  ) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.searchParams.set('notice', 'DLT_DISABLED');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dlt/:path*', '/template-group-list/:path*', '/template-group/:path*', '/dlt-template/:path*', '/report-by-template-group/:path*', '/summary-report-by-template-group/:path*'],
};
