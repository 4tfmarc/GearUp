'use client'
import { useState } from 'react';

export default function TestImgur() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testImgurConnection = async () => {
    setLoading(true);
    try {
      // Small 1x1 transparent pixel as base64
      const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: testImage }),
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        data: data,
        status: response.status
      });
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Imgur API Test</h1>
      <div className="space-y-4">
        <button
          onClick={testImgurConnection}
          disabled={loading}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Imgur Connection'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Test Result:</h2>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
