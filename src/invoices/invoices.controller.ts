import { Controller, Get, Res } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Response } from 'express';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Get('download')
  async downloadInvoice(@Res() res: Response) {
    return this.invoiceService.generateInvoice(res);
  }
}
