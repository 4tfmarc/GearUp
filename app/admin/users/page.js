'use client'
import { useState, useEffect } from 'react';
import { UserPlusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useUsers } from '@/hooks/useUsers';
import UserModal from '@/components/admin/UserModal';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { users, loading, error, createUser, updateUser, updateUserStatus, deleteUser } = useUsers();
  const [actionUserId, setActionUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Add debug logging
  useEffect(() => {
    console.log('Current state:', { users, loading, error });
  }, [users, loading, error]);

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      toast.success('User created successfully');
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to create user');
    }
  };

  const handleEditUser = async (userData) => {
    try {
      await updateUser(selectedUser.id, userData);
      toast.success('User updated successfully');
      setModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      toast.success('User status updated successfully');
    } catch (err) {
      toast.error('Failed to update user status');
    }
    setActionUserId(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
    setActionUserId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="text-gray-600 dark:text-gray-400">Loading users...</div>
          <div className="text-sm text-gray-500">
            {users === undefined ? 'Users data: undefined' : 
             users === null ? 'Users data: null' : 
             `Users count: ${users.length}`}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full mx-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Error loading users
          </h2>
          <div className="bg-red-50 dark:bg-red-900/30 rounded-md p-4">
            <p className="text-sm text-red-800 dark:text-red-300 mb-2">
              {error.message || 'Unknown error occurred'}
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {error.code && <p>Error Code: {error.code}</p>}
              {error.timestamp && <p>Time: {new Date(error.timestamp).toLocaleString()}</p>}
              {error.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Technical Details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
                    {error.details}
                  </pre>
                </details>
              )}
            </div>
          </div>
          <button
            onClick={() => fetchUsers()}
            className="mt-4 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>
        <button 
          onClick={() => {
            setSelectedUser(null);
            setModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name/Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName || 'N/A'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{user.role || 'User'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.joined}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button 
                      onClick={() => setActionUserId(actionUserId === user.id ? null : user.id)}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                    
                    {actionUserId === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalOpen(true);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            Edit User
                          </button>
                          <button
                            onClick={() => handleStatusChange(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            Toggle Status
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            Delete User
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? handleEditUser : handleCreateUser}
        initialData={selectedUser}
      />
    </div>
  );
}
