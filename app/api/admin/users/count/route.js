import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { users } = await adminAuth.listUsers();
    return NextResponse.json({ count: users.length });
  } catch (error) {
    console.error('Error getting user count:', error);
    return NextResponse.json(
      { error: 'Failed to get user count' },
      { status: 500 }
    );
  }
}
