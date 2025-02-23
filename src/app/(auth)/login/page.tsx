'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setConsentChecked(checked);
    if (checked) {
      setShowModal(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }
    setError('Wrong credentials');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: 'linear-gradient(135deg, #0059B3, #003366)' }}
    >
      {/* XP-inspired Background Pattern (optional) */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/xp-pattern.png)', backgroundSize: 'cover' }}></div>
      <div className="relative z-10 max-w-md w-full p-8 bg-gradient-to-b from-[#c3ddf9] to-[#9ec8f0] border border-gray-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_4px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'Tahoma, sans-serif' }}>
        <div
          className="w-20 h-20 mx-auto mb-4"
          style={{
            backgroundImage: "url('/420-logo.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid #003366',
            borderRadius: '4px'
          }}
        ></div>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#003366' }}>420SMS Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded shadow-sm focus:outline-none"
            style={{ background: '#E7F0FA', color: '#003366' }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded shadow-sm focus:outline-none"
            style={{ background: '#E7F0FA', color: '#003366' }}
          />
          <div className="flex items-center text-left" style={{ fontSize: '0.9rem', color: '#003366' }}>
            <input
              type="checkbox"
              id="consent"
              checked={consentChecked}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="consent">
              I agree to the{' '}
              <span
                className="underline cursor-pointer"
                style={{ color: '#003366' }}
                onClick={() => setShowModal(true)}
              >
                Terms of Service & Privacy Policy
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            style={{ fontWeight: 500 }}
          >
            Sign In
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
      </div>

      {/* Modal for Terms of Service & Privacy Policy */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20 transition-opacity duration-500"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded max-w-lg w-full relative transition-transform duration-500"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: 'translateY(0)' }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Tahoma, sans-serif', color: '#003366' }}>
              Terms of Service & Privacy Policy
            </h2>
            <p className="mb-2" style={{ color: '#003366' }}>
              <strong>Overview:</strong> 420SMS offers a comprehensive communication solution that empowers businesses and individuals to engage via two-way SMS/MMS. By using our service, you consent to receive messages related to account notifications, customer support, and other interactions. Standard messaging rates may apply.
            </p>
            <p className="mb-2" style={{ color: '#003366' }}>
              <strong>Consent Collection:</strong> Users provide consent during registration by checking a consent box. This action is recorded along with the timestamp and IP address for compliance purposes.
            </p>
            <p className="mb-2" style={{ color: '#003366' }}>
              <strong>Opt-Out:</strong> Users can opt out of receiving messages at any time by replying "STOP" or contacting our support team at <a href="mailto:support@420sms.life" style={{ color: '#2563eb', textDecoration: 'underline' }}>support@420sms.life</a>.
            </p>
            <p style={{ color: '#003366' }}>
              <strong>Privacy:</strong> We are committed to protecting your privacy. Your data is handled in accordance with our Privacy Policy, ensuring that all personal information is securely stored and processed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
