import { Injectable, Logger } from '@nestjs/common';
import { AppError } from '../common/errors';
import { WalletProvider, WalletTxn } from './wallet-provider.interface';

/**
 * Local in-memory wallet — balance map + txn log with audit shape.
 * TODO: swap with Prisma (Wallet + WalletTxn models) when DATABASE_URL is live.
 */
@Injectable()
export class LocalWalletProvider implements WalletProvider {
  private readonly logger = new Logger(LocalWalletProvider.name);
  private balances = new Map<string, { balance: number; locked: number }>();
  private txns: WalletTxn[] = [];

  private ensure(userId: string): { balance: number; locked: number } {
    let b = this.balances.get(userId);
    if (!b) {
      // Demo seed so local dev has something to spend.
      b = { balance: userId.includes('demo') || userId.includes('customer') ? 1000 : 500, locked: 0 };
      this.balances.set(userId, b);
    }
    return b;
  }

  private record(userId: string, delta: number, reason: string, opts: { refId?: string; createdBy?: string } = {}): WalletTxn {
    const txn: WalletTxn = {
      id: `wtxn_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
      userId,
      delta,
      reason,
      refId: opts.refId,
      createdBy: opts.createdBy,
      at: new Date().toISOString(),
    };
    this.txns.unshift(txn);
    this.logger.log(`[wallet] user=${userId} delta=${delta} reason=${reason} balance=${this.ensure(userId).balance}`);
    return txn;
  }

  async getBalance(userId: string): Promise<{ balance: number; locked: number }> {
    return { ...this.ensure(userId) };
  }

  async debit(userId: string, amount: number, reason: string, opts: { refId?: string; createdBy?: string } = {}): Promise<WalletTxn> {
    if (amount <= 0) throw new AppError('WALLET_BAD_AMOUNT', 'Amount must be positive', 400);
    const b = this.ensure(userId);
    if (b.balance < amount) throw new AppError('WALLET_INSUFFICIENT', 'Insufficient credits', 402, { balance: b.balance, amount });
    b.balance -= amount;
    return this.record(userId, -amount, reason, opts);
  }

  async credit(userId: string, amount: number, reason: string, opts: { refId?: string; createdBy?: string } = {}): Promise<WalletTxn> {
    if (amount <= 0) throw new AppError('WALLET_BAD_AMOUNT', 'Amount must be positive', 400);
    const b = this.ensure(userId);
    b.balance += amount;
    return this.record(userId, amount, reason, opts);
  }

  async topUp(userId: string, amount: number, opts: { refId?: string; createdBy?: string } = {}): Promise<WalletTxn> {
    return this.credit(userId, amount, 'topup', opts);
  }

  async listTxns(userId: string): Promise<WalletTxn[]> {
    return this.txns.filter((t) => t.userId === userId).slice(0, 100);
  }
}
