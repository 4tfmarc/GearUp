import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      console.log('Verify-admin - No session cookie found');
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      console.log('Verify-admin - Decoded claims:', decodedClaims);

      const isAdmin = decodedClaims.admin === true || 
                     (decodedClaims.email && decodedClaims.email.endsWith('@gearup.com'));

      if (!isAdmin) {
        return NextResponse.json({ isAdmin: false }, { status: 403 });
      }

      return NextResponse.json({ isAdmin: true });
    } catch (error) {
      console.error('Verify-admin error:', error);
      // Specifically handle expired sessions
      if (error.code === 'auth/session-cookie-expired') {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
  } catch (error) {
    console.error('Verify-admin route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
