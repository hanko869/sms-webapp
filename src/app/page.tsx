// frontend/src/app/page.tsx
'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-gray-800 opacity-80 z-0"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to 420SMS</h1>
        <p className="text-xl mb-10">
          420SMS empowers companies to streamline their communication with modern, two-way SMS and MMS solutions. Our platform helps improve customer engagement, boost support efficiency, and drive business growth through reliable messaging services.
        </p>
        <Link 
          href="/login" 
          className="inline-block bg-blue-500 hover:bg-blue-700 transition-colors text-white font-bold py-3 px-6 rounded"
        >
          Get Started
        </Link>
      </div>
      <footer className="absolute bottom-4 text-white z-10 text-sm">
        <p>&copy; {new Date().getFullYear()} 420SMS. All rights reserved.</p>
      </footer>
    </main>
  );
}
