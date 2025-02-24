'use client';

import { useEffect, useState, useRef } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'received';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  phoneNumber: string;
  messages: Message[];
}

export default function Dashboard() {
  // Example state with typed arrays
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        setIsLoading(true);
        setError('');

        const res = await fetch('http://localhost:5000/api/dashboard/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data: Conversation[] = await res.json();
        setConversations(data);
        if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchConversations();
  }, []);

  // ... rest of your logic
  // remove or replace any references to `any`

  return (
    <div className="flex h-screen">
      {/* ... */}
    </div>
  );
}
