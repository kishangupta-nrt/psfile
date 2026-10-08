import { Inject, Injectable } from '@nestjs/common';
import { WALLET_PROVIDER, WalletProvider, WalletTxn } from '../../providers/wallet-provider.interface';
import { AppError } from '../../common/errors';

export interface CreditRequest {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  reply?: string;
  createdAt: string;
}

// TODO: swap in-memory credit-requests with Prisma CreditRequest model when DB is up.
@Injectable()
export class WalletService {
  private requests: CreditRequest[] = [];

  constructor(@Inject(WALLET_PROVIDER) private wallet: WalletProvider) {}

  balance(userId: string): Promise<{ balance: number; locked: number }> {
    return this.wallet.getBalance(userId);
  }

  topup(userId: string, amount: number, createdBy?: string): Promise<WalletTxn> {
    return this.wallet.topUp(userId, amount, { createdBy });
  }

  debit(userId: string, amount: number, reason = 'campaign', createdBy?: string): Promise<WalletTxn> {
    return this.wallet.debit(userId, amount, reason, { createdBy });
  }

  credit(userId: string, amount: number, reason = 'adjustment', createdBy?: string): Promise<WalletTxn> {
    return this.wallet.credit(userId, amount, reason, { createdBy });
  }

  txns(userId: string): Promise<WalletTxn[]> {
    return this.wallet.listTxns(userId);
  }

  createRequest(userId: string, amount: number): CreditRequest {
    if (!amount || amount <= 0) throw new AppError('WALLET_BAD_AMOUNT', 'Amount must be positive', 400);
    const r: CreditRequest = { id: `cr_${Date.now()}`, userId, amount, status: 'pending', createdAt: new Date().toISOString() };
    this.requests.unshift(r);
    return r;
  }

  listRequests(): CreditRequest[] {
    return this.requests;
  }

  reply(id: string, status: 'approved' | 'rejected', reply?: string, actorId?: string): Promise<CreditRequest> {
    const r = this.requests.find((x) => x.id === id);
    if (!r) throw new AppError('CREDIT_REQUEST_NOT_FOUND', `Request ${id} not found`, 404);
    r.status = status;
    r.reply = reply;
    if (status === 'approved') {
      return this.wallet.topUp(r.userId, r.amount, { refId: r.id, createdBy: actorId }).then(() => r);
    }
    return Promise.resolve(r);
  }
}
