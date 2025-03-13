import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const excludeId = searchParams.get('exclude');

    console.log('API: Searching for category:', category);

    if (!category) {
      return new Response(JSON.stringify({ error: 'Category is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Normalize category name to match your Firestore data
    const normalizedCategory = category.trim();
    console.log('API: Normalized category:', normalizedCategory);

    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('category', '==', normalizedCategory)
    );

    const querySnapshot = await getDocs(q);
    const products = [];
    
    console.log('API: Found documents:', querySnapshot.size);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('API: Document category:', data.category);
      
      if (doc.id !== excludeId) {
        products.push({ id: doc.id, ...data });
      }
    });

    console.log('API: Returning products:', products.length);

    return new Response(JSON.stringify(products.slice(0, 4)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
