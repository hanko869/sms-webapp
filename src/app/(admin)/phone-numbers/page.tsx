// frontend/src/app/admin/phone-numbers/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface PhoneNumber {
  id: string;
  number?: string; // In case the database field is "number"
  phoneNumber?: string; // In case it's "phoneNumber"
  twilio_sid: string;
  status: string;
  assigned_to?: string | null; // For database field "assigned_to"
  assignedTo?: string | null;  // For "assignedTo"
}

interface User {
  id: string;
  username: string;
  role: string;
}

export default function PhoneNumbersAdmin() {
  // Sub-tab state: either 'rented' or 'available'
  const [activeSubTab, setActiveSubTab] = useState<'rented' | 'available'>('rented');

  // State for rented numbers and available numbers.
  const [rentedNumbers, setRentedNumbers] = useState<PhoneNumber[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [areaCode, setAreaCode] = useState('');
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Fetch rented numbers when the "rented" tab is active.
  useEffect(() => {
    async function fetchRentedNumbers() {
      try {
        const res = await fetch('http://localhost:5000/api/numbers', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch rented phone numbers');
        const data = await res.json();
        setRentedNumbers(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    if (activeSubTab === 'rented') {
      fetchRentedNumbers();
    }
  }, [token, activeSubTab]);

  // Fetch available numbers when the "available" tab is active and after search.
  const handleSearchAvailable = async () => {
    if (!areaCode) return alert("Enter an area code");
    try {
      const res = await fetch(`http://localhost:5000/api/numbers/available?areaCode=${encodeURIComponent(areaCode)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch available phone numbers');
      const data = await res.json();
      setAvailableNumbers(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Fetch users for assignment.
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchUsers();
  }, [token]);

  // Existing rent functionality for the "rented" tab (rent using area code).
  const handleRentNumber = async () => {
    if (!areaCode) return alert("Enter an area code");
    try {
      const res = await fetch('http://localhost:5000/api/numbers/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // If no explicit phoneNumber is provided, backend will use areaCode to rent the first available.
        body: JSON.stringify({ areaCode }),
      });
      if (!res.ok) throw new Error('Failed to rent phone number');
      const newNumber = await res.json();
      setRentedNumbers(prev => [newNumber, ...prev]);
      setAreaCode('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handler for renting a specific available number.
  const handleRentNumberFromAvailable = async (phone: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/numbers/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // Provide the specific phone number to rent.
        body: JSON.stringify({ phoneNumber: phone }),
      });
      if (!res.ok) throw new Error('Failed to rent phone number');
      const newNumber = await res.json();
      // Refresh the rented numbers list.
      setRentedNumbers(prev => [newNumber, ...prev]);
      alert(`Number ${newNumber.number || newNumber.phoneNumber} rented successfully.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle assigning a rented number to a user.
  const handleAssignNumber = async (numberId: string, userId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/numbers/${numberId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to assign phone number');
      const updatedNumber = await res.json();
      setRentedNumbers(prev =>
        prev.map(num => (num.id === updatedNumber.id ? updatedNumber : num))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Phone Number Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Sub-tab Navigation for Rented and Available Numbers */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveSubTab('rented')}
          className={`px-4 py-2 font-medium ${
            activeSubTab === 'rented'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Rented Numbers
        </button>
        <button
          onClick={() => setActiveSubTab('available')}
          className={`px-4 py-2 font-medium ${
            activeSubTab === 'available'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Available Numbers
        </button>
      </div>

      {activeSubTab === 'rented' ? (
        <>
          {/* Rent Number Section for Rented Numbers */}
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
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Phone Number</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Assigned To</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentedNumbers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">
                    No phone numbers found. Rent a new number above.
                  </td>
                </tr>
              ) : (
                rentedNumbers.map((num) => (
                  <tr key={num.id}>
                    <td className="px-4 py-2 border">
                      {num.phoneNumber || num.number}
                    </td>
                    <td className="px-4 py-2 border">{num.status}</td>
                    <td className="px-4 py-2 border">
                      {num.assignedTo || num.assigned_to || 'Unassigned'}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        onChange={(e) => handleAssignNumber(num.id, e.target.value)}
                        value={num.assignedTo || num.assigned_to || ''}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">Assign to...</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      ) : (
        <>
          {/* Available Numbers Section */}
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Enter area code (e.g., 212)"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mr-2"
            />
            <button onClick={handleSearchAvailable} className="bg-blue-600 text-white px-4 py-2 rounded">
              Search Available Numbers
            </button>
          </div>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Available Phone Number</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableNumbers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-center">
                    No available numbers. Enter an area code and search.
                  </td>
                </tr>
              ) : (
                availableNumbers.map((num, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{num.phoneNumber}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleRentNumberFromAvailable(num.phoneNumber)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Rent
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
