'use client'
import { useState } from 'react';
import { useStats } from '@/hooks/useStats';

export default function AdminDashboard() {
  const { stats, loading, error } = useStats();

  if (loading) {
    return <div className="text-center py-4">Loading stats...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
