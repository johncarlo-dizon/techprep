import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TechPrep — IT Interview Practice',
  description: 'AI-powered mock interview practice for IT professionals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
