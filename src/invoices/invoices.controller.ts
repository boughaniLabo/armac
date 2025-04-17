import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Response } from 'express';
import { CreateInvoiceDto } from './CreateInvoiceDto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Get('download')
  async downloadInvoice(@Res() res: Response) {
    return this.invoiceService.generateInvoice(res);
  }


  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    // Appeler la méthode dans le service pour créer une facture
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: number) {
    return this.invoiceService.deleteInvoice(Number(id));
  }

  @Get(':invoiceId/pdf')
  async downloadInvoicePDF(
    @Param('invoiceId') invoiceId: number,
    @Res() res: Response // ⚠️ Pas `{ passthrough: true }`
  ) {
    await this.invoiceService.generateInvoicePDF(Number(invoiceId), res);
  }
  
@Get()
async findAll() {
  return this.invoiceService.findAll();
}
}
