import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    throw new Error('No session cookie found');
  }

  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
  const isAdmin = decodedClaims.admin === true || 
                 (decodedClaims.email && decodedClaims.email.endsWith('@gearup.com'));

  if (!isAdmin) {
    throw new Error('User is not an admin');
  }
  return true;
}

export async function GET() {
  try {
    await verifyAdmin();
    // Get all users from Auth
    const { users: authUsers } = await adminAuth.listUsers();
    
    // Ensure all Auth users exist in Firestore
    const batch = adminDb.batch();
    const promises = authUsers.map(async (user) => {
      const userRef = adminDb.collection('users').doc(user.uid);
      const doc = await userRef.get();
      
      if (!doc.exists) {
        // Create Firestore record if it doesn't exist
        batch.set(userRef, {
          email: user.email,
          displayName: user.displayName,
          role: user.customClaims?.admin ? 'Admin' : 'User',
          status: user.disabled ? 'Inactive' : 'Active',
          joined: user.metadata.creationTime
        });
      }
    });

    await Promise.all(promises);
    await batch.commit();

    // Map users with their current state
    const users = authUsers.map(user => ({
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.customClaims?.admin ? 'Admin' : 'User',
      status: user.disabled ? 'Inactive' : 'Active',
      joined: user.metadata.creationTime
    }));
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await verifyAdmin();
    const userData = await request.json();
    
    // Create Auth user first
    const userRecord = await adminAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      disabled: false
    });

    // Set admin claim if role is Admin
    if (userData.role === 'Admin') {
      await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });
    }

    // Sync to Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role || 'User',
      status: 'Active',
      joined: new Date().toISOString()
    });

    return NextResponse.json({ success: true, userId: userRecord.uid });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { userId, displayName, role } = await request.json();
    
    // Update user
    await adminAuth.updateUser(userId, { displayName });

    // Update admin claim
    await adminAuth.setCustomUserClaims(userId, { admin: role === 'Admin' });

    // Sync to Firestore
    await adminDb.collection('users').doc(userId).update({
      displayName,
      role
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { userId, status } = await request.json();
    
    if (status === 'Inactive') {
      await adminAuth.updateUser(userId, { disabled: true });
    } else {
      await adminAuth.updateUser(userId, { disabled: false });
    }

    // Sync to Firestore
    await adminDb.collection('users').doc(userId).update({
      status
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { userId } = await request.json();
    await adminAuth.deleteUser(userId);

    // Remove from Firestore
    await adminDb.collection('users').doc(userId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
