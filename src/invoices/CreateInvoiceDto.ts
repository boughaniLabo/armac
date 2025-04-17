// src/invoices/dto/create-invoice.dto.ts
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Nom ou référence de la facture

  @IsDateString()
  @IsNotEmpty()
  date: string; // Date de la facture

  @IsArray()
  @IsNotEmpty()
  items: { productId: number; quantity: number; price: number }[]; // Les articles de la facture

  @IsNumber()
  @IsOptional()
  total: number; // Montant total de la facture
}
