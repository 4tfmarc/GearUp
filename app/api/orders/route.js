import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get the order data from request body
    const orderData = await request.json();

    // Create the order in Firestore using adminDb
    const orderRef = await adminDb.collection('orders').add({
      ...orderData,
      userId: decodedToken.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'PENDING'
    });

    // Get the created order
    const order = await orderRef.get();

    // Return the created order with its ID
    return NextResponse.json({
      id: orderRef.id,
      ...order.data()
    });

  } catch (error) {
    console.error('Order creation error details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
