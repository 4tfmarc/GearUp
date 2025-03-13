import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      setLoading(true);
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(query(productsCollection));
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched products:', productsList);
      setProducts(productsList);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const newProduct = {
        ...productData,
        rating: parseFloat(productData.rating) || 0,
        reviewCount: parseInt(productData.reviewCount, 10) || 0,
        soldCount: parseInt(productData.soldCount, 10) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      await fetchProducts(); // Refresh products list
      return { ...newProduct, id: docRef.id };
    } catch (error) {
      throw new Error('Error creating product: ' + error.message);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updateData = {
        ...productData,
        rating: parseFloat(productData.rating) || 0,
        reviewCount: parseInt(productData.reviewCount, 10) || 0,
        soldCount: parseInt(productData.soldCount, 10) || 0,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(doc(db, 'products', id), updateData);
      return { ...updateData, id };
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      await fetchProducts();
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts
  };
}
