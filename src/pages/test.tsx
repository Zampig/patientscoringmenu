import React from 'react';
import Head from 'next/head';

export default function Test() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Test Page</title>
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-4">Test Page</h1>
        <p className="mb-4">This is a simple test page with no complex components.</p>
        
        <div className="p-4 bg-white rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">Basic Form</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="John Doe"
              />
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
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