import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from 'src/users/entities/invoice.entity';
import { InvoiceItem } from 'src/users/entities/invoice_item.entity';
import { ProductsModule } from 'src/products/products.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem]), // ✅ déclaration des entités
    ProductsModule, // ✅ si tu appelles productService.findById()
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoiceModule {}
