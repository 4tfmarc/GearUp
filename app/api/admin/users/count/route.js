import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('Firebase configuration is not complete');
    }
    const { users } = await adminAuth.listUsers();
    return NextResponse.json({ count: users.length });
  } catch (error) {
    console.error('Error getting user count:', error);
    return NextResponse.json(
      { error: 'Failed to get user count: ' + error.message },
      { status: 500 }
    );
  }
}
