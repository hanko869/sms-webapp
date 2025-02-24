'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Removed error state since it was never used: const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('users');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState({ id: '', username: '', password: '', role: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      setIsLoading(true);
      // removed error usage

      const usersRes = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!usersRes.ok) {
        throw new Error('Failed to fetch users');
      }

      const usersData = await usersRes.json();
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      // If you want to track error in state, reintroduce setError and display it
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // The rest of your add/edit user logic remains the same, 
  // just remove references to `error` if you never use them.

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      {/* ...rest of your admin dashboard code... */}
    </div>
  );
}
