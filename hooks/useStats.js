import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export function useStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserCount = async () => {
    const response = await fetch('/api/admin/users/count');
    const data = await response.json();
    return data.count;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsCount = productsSnapshot.size;

        // Fetch orders and calculate revenue
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersCount = ordersSnapshot.size;
        const totalRevenue = 0;
        // const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => {
        //   const data = doc.data();
        //   return sum + (data.total || 0);
        // }, 0);

        // Fetch users count
        const usersCount = await fetchUserCount();

        setStats({
          totalOrders: ordersCount,
          totalRevenue: totalRevenue,
          totalUsers: usersCount,
          totalProducts: productsCount,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
