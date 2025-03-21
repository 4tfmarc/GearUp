'use client'
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  CogIcon,
  TagIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Products', href: '/admin/products', icon: TagIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  const handleSignOut = async () => {
    const loadingToast = toast.loading('Signing out...');
    try {
      await signOut();
      toast.success('Signed out successfully!', { id: loadingToast });
      router.push('/signin');
    } catch (error) {
      toast.error('Failed to sign out.', { id: loadingToast });
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out w-64 z-50 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-4 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="mr-3 h-6 w-6" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className={`lg:pl-64 flex flex-col min-h-screen ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <div className="sticky top-0 z-10 lg:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-4 py-5 sm:px-6"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
