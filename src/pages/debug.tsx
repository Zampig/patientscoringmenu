import React from 'react';
import Head from 'next/head';

export default function Debug() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Debug Page</title>
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-4">Debug Page</h1>
        <p className="mb-4">If you can see this page, Next.js is working correctly.</p>
        
        <div className="p-4 bg-white rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
          <p>GHL Webhook URL: {process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL || 'Not set'}</p>
        </div>
        
        <div className="p-4 bg-white rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">CSS Test</h2>
          <div className="flex space-x-4">
            <div className="w-16 h-16 bg-primary-500 rounded"></div>
            <div className="w-16 h-16 bg-secondary-500 rounded"></div>
            <div className="w-16 h-16 bg-green-500 rounded"></div>
            <div className="w-16 h-16 bg-red-500 rounded"></div>
          </div>
        </div>
        
        <a 
          href="/" 
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home Page
        </a>
      </main>
    </div>
  );
} 