'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth';

const SECTIONS: { title: string; links: { href: string; label: string }[] }[] = [
  { title: 'Dashboards', links: [{ href: '/dashboard', label: 'Dashboard' }] },
  { title: 'Messaging', links: [
    { href: '/send-sms', label: 'Send SMS' },
    { href: '/campaigns', label: 'Campaigns' },
    { href: '/campaign-report', label: 'All Campaign Report' },
    { href: '/scheduled-campaign-report', label: 'Scheduled Report' },
    { href: '/detailed-report', label: 'Detailed Report' },
    { href: '/export-report', label: 'Download Report' },
  ]},
  { title: 'Phone Book', links: [
    { href: '/contacts', label: 'Phone Book' },
    { href: '/blacklist', label: 'BlackList' },
    { href: '/sender-list', label: 'Sender ID' },
    { href: '/notification-template', label: 'Notification Template' },
  ]},
  { title: 'Credits', links: [
    { href: '/credits', label: 'Credits / Wallet' },
    { href: '/credit-request', label: 'Credit Request' },
    { href: '/user-credit-report', label: 'User Credit Report' },
  ]},
  { title: 'Voice', links: [
    { href: '/voice-sms', label: 'Voice SMS' },
    { href: '/voice-upload', label: 'Voice Upload' },
    { href: '/voice-report', label: 'Voice Report' },
  ]},
  { title: 'Whatsapp', links: [
    { href: '/send-whatsapp', label: 'Whatsapp Message' },
    { href: '/whatsapp-message-report', label: 'Message Report' },
    { href: '/whatsapp-summary-report', label: 'Summary Report' },
    { href: '/whatsapp-media', label: 'Whatsapp Media' },
  ]},
  { title: 'API', links: [
    { href: '/api-documentation', label: 'APIs / Docs' },
    { href: '/webhooks', label: 'Webhooks' },
  ]},
  { title: 'Users', links: [
    { href: '/users-list', label: 'Users' },
    { href: '/profile', label: 'Profile' },
    { href: '/notifications', label: 'Notifications' },
  ]},
  { title: 'Admin', links: [
    { href: '/admin-manage-campaign', label: 'Manage Campaign' },
    { href: '/admin-settings', label: 'Settings' },
    { href: '/get-kannel-status', label: 'Kannel Status' },
  ]},
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { can } = useAuth();
  return (
    <>
      <div className={`scrim${open ? ' show' : ''}`} onClick={onClose} />
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <Link href="/dashboard" className="brand">NRT-SMS</Link>
        <div className="side-scroll">
          {SECTIONS.map((s) => (
            <div key={s.title} className="side-sec">
              <div className="side-title">{s.title}</div>
              {s.links.map((l) => (
                <Link key={l.href} href={l.href} onClick={onClose}
                  className={pathname === l.href ? 'side-link active' : 'side-link'}>{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
