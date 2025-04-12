import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';

@Module({
  controllers: [InvoicesController], // Ajoute bien ton contrôleur ici
  providers: [InvoicesService],
})
export class InvoiceModule {}
