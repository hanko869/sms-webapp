'use client';

import { useState, useEffect } from 'react';

export default function Navigation() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode JWT token to get user role
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          setUserRole(payload.role);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    checkUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-xl font-bold">420SMS</a>
          {userRole && (
            <>
              {/* Common Dashboard link */}
              <a href="/dashboard" className="hover:text-indigo-200">Dashboard</a>
              
              {userRole === 'admin' && (
                <>
                  {/* Admin-specific links */}
                  <a href="/admin" className="hover:text-indigo-200">Admin Dashboard</a>
                  <a href="/phone-numbers" className="hover:text-indigo-200">Phone Numbers</a>
                </>
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
            <a 
              href="/login"
              className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
);
}
