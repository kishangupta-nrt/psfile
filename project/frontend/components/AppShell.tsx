'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastHost, ToastProvider } from './Toast';

const AUTH_ROUTES = ['/authentication', '/register-user', '/two-factor-authentication', '/', '/whatsapp-policy'];
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAuth = AUTH_ROUTES.includes(pathname ?? '');
  if (isAuth) return <ToastProvider><ToastHost />{children}</ToastProvider>;
  return (
    <ToastProvider>
      <div className="shell">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="main">
          <Header onMenu={() => setOpen(true)} />
          <div className="content">{children}</div>
        </div>
      </div>
      <ToastHost />
    </ToastProvider>
  );
}
