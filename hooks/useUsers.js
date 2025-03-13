import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (!user?.isAdmin) {
        throw new Error('Unauthorized access');
      }

      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setUsers(data.users);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Failed to create user');
      
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...userData }),
      });

      if (!response.ok) throw new Error('Failed to update user');
      
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, status }),
      });

      if (!response.ok) throw new Error('Failed to update user');
      
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating user status:', err);
      throw err;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers();
    }
  }, [user]);

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser
  };
}
