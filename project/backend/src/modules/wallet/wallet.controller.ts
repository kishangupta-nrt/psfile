import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private wallet: WalletService) {}

  @Get('balance')
  balance(@Query('userId') userId = 'u_customer') {
    return this.wallet.balance(userId);
  }

  @Post('topup')
  topup(@Body() b: { userId: string; amount: number }) {
    return this.wallet.topup(b.userId, Number(b.amount));
  }

  @Post('debit')
  debit(@Body() b: { userId: string; amount: number; reason?: string }) {
    return this.wallet.debit(b.userId, Number(b.amount), b.reason ?? 'campaign');
  }

  @Post('credit')
  credit(@Body() b: { userId: string; amount: number; reason?: string }) {
    return this.wallet.credit(b.userId, Number(b.amount), b.reason ?? 'adjustment');
  }

  @Get('txns')
  txns(@Query('userId') userId = 'u_customer') {
    return this.wallet.txns(userId);
  }

  @Post('credit-requests')
  createRequest(@Body() b: { userId: string; amount: number }) {
    return this.wallet.createRequest(b.userId, Number(b.amount));
  }

  @Get('credit-requests')
  listRequests() {
    return this.wallet.listRequests();
  }

  @Post('credit-requests/:id/reply')
  reply(@Param('id') id: string, @Body() b: { status: 'approved' | 'rejected'; reply?: string }) {
    return this.wallet.reply(id, b.status, b.reply);
  }
}
