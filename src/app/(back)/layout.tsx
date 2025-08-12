import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/layout/NotificationContext';
import { LoadingProvider } from '@/context/LoadingContext'; // your loading context

const outfit = Outfit({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Wifak Bank',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
      <NotificationProvider>
        <ThemeProvider>
          <SidebarProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </SidebarProvider>
        </ThemeProvider>
      </NotificationProvider>
      </body>
      </html>
  );
}
