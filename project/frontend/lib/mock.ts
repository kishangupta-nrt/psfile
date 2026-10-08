// Offline mock data used when the NestJS backend is unreachable.
// All pages try lib/api first, then fall back to these shapes.

export const mockSummary = {
  userId: 'u_customer',
  wallet: { userId: 'u_customer', balance: 1250.5, currency: 'INR' },
  campaigns: { total: 12, queued: 2, sending: 1, completed: 9 },
  delivered: { total: 18400, delivered: 17250, failed: 1150, rate: '93.75%' },
  recentTxns: [
    { id: 'txn_1', type: 'credit', amount: 1000, note: 'Top-up', createdAt: new Date().toISOString() },
    { id: 'txn_2', type: 'debit', amount: 500, note: 'Campaign cmp_1', createdAt: new Date().toISOString() },
    { id: 'txn_3', type: 'debit', amount: 250, note: 'Campaign cmp_2', createdAt: new Date().toISOString() },
  ],
  recentCampaigns: [
    { id: 'cmp_1', message: 'Hello', status: 'completed', total: 500, delivered: 480, failed: 20, createdAt: new Date().toISOString() },
    { id: 'cmp_2', message: 'Welcome offer', status: 'sending', total: 250, delivered: 100, failed: 5, createdAt: new Date().toISOString() },
    { id: 'cmp_3', message: 'OTP test', status: 'queued', total: 100, delivered: 0, failed: 0, createdAt: new Date().toISOString() },
  ],
};

export const mockCampaigns = mockSummary.recentCampaigns;

export const mockGroups = [
  { id: 'grp_1', name: 'Family', count: 12 },
  { id: 'grp_2', name: 'Staff', count: 34 },
];

export const mockNumbers = ['919999999901', '919999999902', '919999999903'];

export const mockBlacklist = [{ mobile: '919999999999', reason: 'Opt-out request' }];

export const mockSenders = [
  { id: 'NRTINF', senderId: 'NRTINF', status: 'approved' },
  { id: 'NRTOTP', senderId: 'NRTOTP', status: 'approved' },
];

export const mockBalance = mockSummary.wallet;

export const mockTxns = mockSummary.recentTxns;

export const mockCreditRequests = [
  { id: 'cr_1', amount: 500, status: 'pending', createdAt: new Date().toISOString() },
];

export const mockVoiceCampaigns = [
  { id: 'vcp_1', file: 'promo.mp3', status: 'completed', total: 50, createdAt: new Date().toISOString() },
];

export const mockWhatsapp = [
  { id: 'wa_1', to: '919999999901', template: 'hello_world', status: 'delivered' },
];

export const mockUsers = [
  { id: 'u_admin', email: 'admin@nrt.local', role: 'admin' },
  { id: 'u_customer', email: 'sms@nrt.co.in', role: 'customer' },
];

export const mockKannelStatus = {
  ok: true,
  uptime: '0d 0h 12m',
  smsbox: 'running',
};

export const mockApiDocs = [
  { method: 'POST', path: '/auth/login', desc: 'Login, returns { user, access_token, abilities }' },
  { method: 'POST', path: '/campaigns', desc: 'Create SMS campaign { ownerId, senderId, message, mobiles[] }' },
  { method: 'GET', path: '/campaigns', desc: 'List campaigns (?ownerId=)' },
  { method: 'GET', path: '/reports/campaigns', desc: 'Campaign report (?from&to&status=)' },
  { method: 'GET', path: '/contacts/groups', desc: 'List contact groups' },
  { method: 'GET', path: '/blacklist', desc: 'List blacklisted mobiles' },
  { method: 'GET', path: '/senders', desc: 'List sender IDs' },
  { method: 'GET', path: '/wallet/balance', desc: 'Wallet balance' },
  { method: 'GET', path: '/wallet/txns', desc: 'Wallet transactions' },
  { method: 'POST', path: '/voice/campaigns/send', desc: 'Send voice campaign' },
  { method: 'POST', path: '/whatsapp/send', desc: 'Send WhatsApp message' },
  { method: 'GET', path: '/admin/kannel-status', desc: 'Kannel / gateway status (admin)' },
];

export const OFFLINE_NOTE = 'Offline demo data.';
