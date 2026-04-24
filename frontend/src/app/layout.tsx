import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Profit Compass — Find Your Online Income Path',
  description: 'Answer 7 questions. Get personalized, actionable online income ideas ranked by feasibility.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
