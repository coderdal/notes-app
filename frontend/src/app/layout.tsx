import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers';
import RouteProgressBar from '@/components/ui/RouteProgressBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Notes App',
  description: 'A modern note-taking application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <RouteProgressBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
