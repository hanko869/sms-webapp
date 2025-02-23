// frontend/src/app/dashboard/page.tsx
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
  // Tab state: 'conversations' or 'bulk'
  const [activeTab, setActiveTab] = useState<'conversations' | 'bulk'>('conversations');

  // Conversation-related state and logic.
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // New state for bulk messaging.
  const [bulkNumbers, setBulkNumbers] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');

  // Ref for the hidden file input (for attachments).
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: count phone numbers in the bulk messaging field.
  const countPhoneNumbers = () =>
    bulkNumbers
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '').length;

  // Fetch messages history when the conversations tab is active.
  useEffect(() => {
    if (activeTab !== 'conversations') return;
    async function fetchMessages() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        setIsLoading(true);
        setError('');

        const res = await fetch('http://localhost:5000/api/messages/history', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error('Failed to fetch messages: ' + errorText);
        }
        const messages = await res.json();

        // Wrap the flat array of messages into a single conversation.
        const conversation: Conversation = {
          id: 'default',
          phoneNumber: 'Your Number', // Adjust as needed.
          messages: Array.isArray(messages) ? messages : [],
        };
        setConversations([conversation]);
        setSelectedConversation(conversation);
      } catch (err: any) {
        setError(err.message || 'Error fetching conversations');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, [activeTab]);

  // Auto-scroll to the bottom when the selected conversation updates.
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation]);

  // Handler for sending a message.
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || messageInput.trim() === '') return;
    try {
      const token = localStorage.getItem('token');
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: messageInput,
        timestamp: new Date().toISOString(),
      };
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ to: selectedConversation.phoneNumber, content: messageInput }),
      });
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      const updatedConversation: Conversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage],
      };
      setSelectedConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((conv) => (conv.id === selectedConversation.id ? updatedConversation : conv))
      );
      setMessageInput('');
    } catch (err: any) {
      setError(err.message || 'Error sending message');
    }
  };

  // Handler for bulk messaging send.
  const handleBulkSend = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, simulate bulk sending.
    console.log('Bulk sending to:', bulkNumbers);
    console.log('Bulk message:', bulkMessage);
    alert('Bulk message sent (simulated)!');
    setBulkNumbers('');
    setBulkMessage('');
  };

  // Handler for the Attach icon button click.
  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler for file input change.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Process the attached file.
      console.log('Attached file:', file);
      // You could implement uploading the file or converting it to a preview.
      // For now, we simply log the file.
    }
  };

  // Handler for adding a new conversation via the Add Number icon.
  const handleAddNumber = () => {
    const phone = prompt('Enter phone number (e.g., 123-456-7890):');
    if (phone) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        phoneNumber: phone,
        messages: [],
      };
      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabbed Navigation Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'conversations'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Conversations
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'bulk'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Bulk Messaging
            </button>
          </nav>
        </div>
      </header>

      {activeTab === 'conversations' && (
        <div className="flex h-[calc(100vh-64px)]">
          {isLoading ? (
            <div className="flex items-center justify-center w-full">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            <>
              {/* Conversation List with Add Number Icon */}
              <aside className="w-1/3 border-r border-gray-300 overflow-y-auto">
                <div className="p-4 border-b border-gray-300 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Conversations</h2>
                  <button onClick={handleAddNumber} title="Add Number">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600 hover:text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {conversations.length === 0 ? (
                  <div className="p-4 text-gray-500">No conversations found.</div>
                ) : (
                  <ul>
                    {conversations.map((conv) => (
                      <li
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`cursor-pointer p-4 hover:bg-gray-100 ${
                          selectedConversation?.id === conv.id ? 'bg-gray-200' : ''
                        }`}
                      >
                        <div className="font-semibold">{conv.phoneNumber}</div>
                        <div className="text-sm text-gray-500">
                          {conv.messages.length > 0
                            ? conv.messages[conv.messages.length - 1].content.slice(0, 30) + '...'
                            : 'No messages yet'}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </aside>

              {/* Chat Window */}
              <main className="flex flex-col flex-1">
                <header className="p-4 border-b border-gray-300">
                  <h2 className="text-xl font-bold">
                    {selectedConversation
                      ? `Chat with ${selectedConversation.phoneNumber}`
                      : 'Select a conversation'}
                  </h2>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                  {selectedConversation && selectedConversation.messages.length > 0 ? (
                    selectedConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-2 p-2 rounded max-w-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-100 ml-auto text-right'
                            : 'bg-gray-100 mr-auto text-left'
                        }`}
                      >
                        <div>{msg.content}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No messages. Start the conversation!
                    </p>
                  )}
                  <div ref={messageEndRef}></div>
                </div>
                {/* Message Input Form with Attach Icon */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 flex items-center">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {/* Attach Icon Button */}
                  <button
                    type="button"
                    onClick={handleAttachClick}
                    className="mr-2"
                    title="Attach Image or MMS"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600 hover:text-gray-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 00-5.656-5.656L6 10.515" />
                    </svg>
                  </button>
                  {/* Text Message Input */}
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2 focus:outline-none"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  {/* Send Button */}
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Send
                  </button>
                </form>
              </main>
            </>
          )}
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="max-w-7xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Bulk Messaging</h2>
          <form onSubmit={handleBulkSend}>
            <div className="flex flex-col md:flex-row md:space-x-4">
              {/* Phone Numbers Input */}
              <div className="flex-1 mb-4 md:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Numbers
                </label>
                <textarea
                  value={bulkNumbers}
                  onChange={(e) => setBulkNumbers(e.target.value)}
                  placeholder="Enter phone numbers separated by commas or new lines. e.g., 123-456-7890, 234-567-8901"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  rows={6}
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Example: 123-456-7890, 234-567-8901
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {countPhoneNumbers()}/100 numbers
                </p>
              </div>
              {/* Message Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Enter your bulk message here..."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  rows={6}
                ></textarea>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send Bulk Message
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
