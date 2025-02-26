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
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data: Conversation[] = await res.json();
        console.log('Fetched conversations:', data);
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

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || messageInput.trim() === '') return;
    try {
      const token = localStorage.getItem('token');
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: messageInput,
        timestamp: new Date().toISOString()
      };
      const res = await fetch(`http://localhost:5000/api/dashboard/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: messageInput })
      });
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      const updatedConversation: Conversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage]
      };
      setSelectedConversation(updatedConversation);
      setConversations(prev =>
        prev.map(conv => conv.id === selectedConversation.id ? updatedConversation : conv)
      );
      setMessageInput('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen">
      <aside className="w-1/3 border-r border-gray-300 overflow-y-auto">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>
        {conversations.length === 0 ? (
          <div className="p-4 text-gray-500">
            No conversations found.
          </div>
        ) : (
          <ul>
            {conversations.map((conv) => (
              <li
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`cursor-pointer p-4 hover:bg-gray-100 ${selectedConversation?.id === conv.id ? 'bg-gray-200' : ''}`}
              >
                <div className="font-semibold">{conv.phoneNumber}</div>
                <div className="text-sm text-gray-500">
                  {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content.slice(0, 30) + '...' : 'No messages yet'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
      <main className="flex flex-col flex-1">
        <header className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">
            {selectedConversation ? `Chat with ${selectedConversation.phoneNumber}` : 'Select a conversation'}
          </h2>
        </header>
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedConversation && selectedConversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100 mr-auto text-left'}`}
            >
              <div>{msg.content}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2 focus:outline-none"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
