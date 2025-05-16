'use client';

import { useEffect, useState } from 'react';

export default function EnvTestPage() {
  const [clientEnv, setClientEnv] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // This runs on the client
    setClientEnv(process.env.NEXT_PUBLIC_API_URL);
    console.log('Client-side NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Client-side:</h2>
        <p>NEXT_PUBLIC_API_URL: <strong>{clientEnv || 'undefined'}</strong></p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Hard-coded values in code:</h2>
        <p>process.env.NEXT_PUBLIC_API_URL directly: <strong>{process.env.NEXT_PUBLIC_API_URL || 'undefined'}</strong></p>
      </div>

      <p className="mt-4 text-gray-600">
        Note: Check your browser console for additional debug output.
      </p>
    </div>
  );
} 