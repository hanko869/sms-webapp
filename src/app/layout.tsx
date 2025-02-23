import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '420SMS',
  description: 'SMS/MMS Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}