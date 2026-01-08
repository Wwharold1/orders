import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import { AUTH_LOCAL_STORAGE_KEY } from '@/common/helper/authHelper';

const redirectToLogin = (req: NextRequest) => {
  return NextResponse.redirect(new URL('/', req.url));
};

const redirectToHome = (req: NextRequest) => {
  return NextResponse.redirect(new URL('/dashboard', req.url));
};

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get(AUTH_LOCAL_STORAGE_KEY)?.value;
  const stayLoggedIn = req.cookies.get('stayLoggedIn')?.value;
  const secretJWT = process.env.NEXT_JWT_SECRET;
  const currentUrl = req.nextUrl.pathname;
  console.log(sessionCookie, ' sessionCookie')
  console.log(secretJWT, ' secretJWT')
  console.log(currentUrl, ' currentUrl')

  if (sessionCookie && secretJWT) {
    try {
      const {
        payload: { exp: expirationTime },
      } = await jwtVerify(sessionCookie, new TextEncoder().encode(secretJWT));

      if (expirationTime) {
        if (expirationTime * 1000 < Date.now()) {
          document.cookie = `${AUTH_LOCAL_STORAGE_KEY}=; Path=/;`;
        } else if (currentUrl === '/' && stayLoggedIn) {
          return redirectToHome(req);
        }
      }
    } catch (error) {
      if (currentUrl !== '/') {
        return redirectToLogin(req);
      }
    }
  } else {
    if (currentUrl !== '/') {
      return redirectToLogin(req);
    }
  }
}

export const config = {
  matcher: ['/dashboard','/order', '/'],
};
