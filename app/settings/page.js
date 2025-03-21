'use client'
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    darkMode: false,
  });

  const handleChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success('Setting updated successfully!');
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications</h2>
              <div className="space-y-4">
                {[
                  {
                    id: 'emailNotifications',
                    title: 'Email Notifications',
                    description: 'Receive notifications about your account via email'
                  },
                  {
                    id: 'marketingEmails',
                    title: 'Marketing Emails',
                    description: 'Receive emails about new products and offers'
                  },
                  {
                    id: 'orderUpdates',
                    title: 'Order Updates',
                    description: 'Get notified about your order status changes'
                  },
                  {
                    id: 'darkMode',
                    title: 'Dark Mode',
                    description: 'Toggle dark mode for the website'
                  }
                ].map((setting) => (
                  <div key={setting.id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={setting.id}
                        type="checkbox"
                        checked={settings[setting.id]}
                        onChange={() => handleChange(setting.id)}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor={setting.id} className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.title}
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
