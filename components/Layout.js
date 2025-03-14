import Head from 'next/head';

export default function Layout({ children, title = 'Patient Engagement Dashboard' }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Patient Engagement Dashboard for GoHighLevel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Patient Engagement Dashboard
        </div>
      </footer>
    </div>
  );
} 