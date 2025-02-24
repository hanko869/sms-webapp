'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setUserRole(payload.role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Instead of <a href="/">, use <Link> */}
          <Link href="/" className="text-xl font-bold">
            420SMS
          </Link>
          {userRole && (
            <>
              <Link href="/dashboard" className="hover:text-indigo-200">
                Dashboard
              </Link>
              {userRole === 'admin' && (
                <Link href="/(admin)/admin" className="hover:text-indigo-200">
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </div>
        <div>
          {userRole ? (
            <button
              onClick={handleLogout}
              className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800"
            >
              Logout
            </button>
          ) : (
            <Link href="/(auth)/login" className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
