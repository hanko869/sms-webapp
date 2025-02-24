'use client';

import { useEffect, useState } from 'react';

interface PhoneNumber {
  id: string;
  number: string;
  twilio_sid: string;
  status: string;
  assigned_to?: string | null;
}

interface User {
  id: string;
  username: string;
  role: string;
}

export default function PhoneNumbersAdmin() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [areaCode, setAreaCode] = useState('');
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    async function fetchPhoneNumbers() {
      try {
        const res = await fetch('http://localhost:5000/api/numbers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch phone numbers');
        const data: PhoneNumber[] = await res.json();
        setPhoneNumbers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    }
    fetchPhoneNumbers();
  }, [token]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    }
    fetchUsers();
  }, [token]);

  // Example function that returns available numbers, removing `any`.
  const handleRentNumber = async () => {
    if (!areaCode) return alert('Enter an area code');
    try {
      const res = await fetch('http://localhost:5000/api/numbers/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ areaCode }),
      });
      if (!res.ok) throw new Error('Failed to rent phone number');
      const newNumber: PhoneNumber = await res.json();
      setPhoneNumbers((prev) => [newNumber, ...prev]);
      setAreaCode('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  const handleAssignNumber = async (numberId: string, userId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/numbers/${numberId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to assign phone number');
      const updatedNumber: PhoneNumber = await res.json();
      setPhoneNumbers((prev) =>
        prev.map((num) => (num.id === updatedNumber.id ? updatedNumber : num))
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Phone Number Management</h1>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Enter area code (e.g., 212)"
          value={areaCode}
          onChange={(e) => setAreaCode(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mr-2"
        />
        <button onClick={handleRentNumber} className="bg-blue-600 text-white px-4 py-2 rounded">
          Rent Number
        </button>
      </div>
      {/* Table of phone numbers, assignment, etc. */}
      {/* ... */}
    </div>
  );
}
