export const WALLET_PROVIDER = 'WALLET_PROVIDER';

export interface WalletTxn {
  id: string;
  userId: string;
  delta: number;
  reason: string;
  refId?: string;
  createdBy?: string;
  at: string;
}

export interface WalletProvider {
  getBalance(userId: string): Promise<{ balance: number; locked: number }>;
  debit(userId: string, amount: number, reason: string, opts?: { refId?: string; createdBy?: string }): Promise<WalletTxn>;
  credit(userId: string, amount: number, reason: string, opts?: { refId?: string; createdBy?: string }): Promise<WalletTxn>;
  topUp(userId: string, amount: number, opts?: { refId?: string; createdBy?: string }): Promise<WalletTxn>;
  listTxns(userId: string): Promise<WalletTxn[]>;
}
