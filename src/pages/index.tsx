import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Chiropractic Patient Feedback Form</title>
        <meta name="description" content="Provide feedback about your chiropractic treatment experience" />
      </Head>

      <main className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Chiropractic Patient Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your feedback helps us improve our services and provide better care.
            Please take a moment to complete this short form.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <p className="mb-4">Welcome to the Chiropractic Lead Scoring System.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/test" legacyBehavior>
              <a className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Go to Test Page
              </a>
            </Link>
            <Link href="/debug" legacyBehavior>
              <a className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Go to Debug Page
              </a>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Your information is securely processed and protected in accordance with our privacy policy.
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Chiropractic Wellness Center. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
} 