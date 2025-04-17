import { Injectable, NotFoundException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { Response } from 'express';
import { CreateInvoiceDto } from './CreateInvoiceDto';
import { ProductsService } from 'src/products/products.service';
import { InvoiceItem } from 'src/users/entities/invoice_item.entity';
import { Invoice } from 'src/users/entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InvoicesService {

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    private productService: ProductsService,  // Injection de ProductService
  ) {}


  async generateInvoicePDF(invoiceId: number, res: Response) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['items', 'items.product'],
    });
  
    if (!invoice) {
      res.status(404).send('Facture non trouvée');
      return;
    }
  
    const doc = new PDFDocument({ margin: 50 });
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture_${invoiceId}.pdf`);
    doc.pipe(res);
  
    // En-tête entreprise
    doc
      .fontSize(10)
      .text('Nom de l’Entreprise', 50, 50)
      .text('Adresse', 50, 65)
      .text('Code Postal et Ville', 50, 80)
      .text('Numéro de téléphone', 50, 95)
      .text('Email', 50, 110);
  
    // En-tête client (à personnaliser si données disponibles)
    doc
      .text('Nom du client', 350, 50)
      .text('Adresse', 350, 65)
      .text('Code Postal et Ville', 350, 80)
      .text('Numéro de téléphone', 350, 95)
      .text('Email', 350, 110);
  
    // Infos facture
    doc
      .fontSize(12)
      .text(`Numéro de facture: ${invoice.id}`, 50, 160)
      .text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 50, 175)
      .text(`Objet : Facture`, 50, 195);
  
    // En-tête du tableau
    const tableTop = 220;
    const itemHeight = 25;
  
    doc
      .fontSize(12)
      .fillColor('white')
      .rect(50, tableTop, 500, itemHeight)
      .fill('#4B0082') // violet
      .fillColor('white')
      .text('Description', 55, tableTop + 5)
      .text('Quantité', 200, tableTop + 5)
      .text('Prix Unitaire HT', 270, tableTop + 5)
      .text('TVA', 390, tableTop + 5)
      .text('Total HT', 450, tableTop + 5);
  
    doc.fillColor('black');
  
    let y = tableTop + itemHeight;
    let totalHT = 0;
    const tvaRate = 0.2;
  
    // Produits
    invoice.items.forEach(item => {
      const prixHT = Number(item.price);
      const totalLigneHT = prixHT * item.quantity;
      totalHT += totalLigneHT;
  
      doc
        .fontSize(11)
        .text(item.product.name, 55, y)
        .text(item.quantity.toString(), 210, y)
        .text(`${prixHT.toFixed(2)} DA`, 270, y)
        .text(`20 %`, 400, y)
        .text(`${totalLigneHT.toFixed(2)} DA`, 450, y);
  
      y += 20;
    });
  
    // Totaux
    const totalTVA = totalHT * tvaRate;
    const totalTTC = totalHT + totalTVA;
  
    y += 30;
  
    doc
      .fontSize(12)
      .text(`Montant Total HT: ${totalHT.toFixed(2)} DA`, 400, y)
      .text(`Total TVA: ${totalTVA.toFixed(2)} DA`, 400, y + 15)
      .font('Helvetica-Bold')
      .text(`Montant Total TTC: ${totalTTC.toFixed(2)} DA`, 400, y + 35);
  
    doc.end();
  }



  async generateInvoicePDF5(invoiceId: number, res: Response) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['items', 'items.product'],
    });
  
    if (!invoice) {
      res.status(404).send('Facture non trouvée');
      return;
    }
  
    const doc = new PDFDocument({ margin: 50 });
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture_${invoiceId}.pdf`);
  
    doc.pipe(res);
  
    // En-tête
    doc
      .fontSize(10)
      .text('Nom de l’Entreprise', 50, 50)
      .text('Adresse', 50, 65)
      .text('Code Postal et Ville', 50, 80)
      .text('Numéro de téléphone', 50, 95)
      .text('Email', 50, 110);
  
    doc
      .text('Nom du client', 350, 50)
      .text('Adresse', 350, 65)
      .text('Code Postal et Ville', 350, 80)
      .text('Numéro de téléphone', 350, 95)
      .text('Email', 350, 110);
  
    doc.moveDown();
  
    doc
      .fontSize(12)
      .text(`Numéro de facture: ${invoice.id}`, 50, 160)
      .text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 50, 175)
      .text(`Objet : Facture`, 50, 195);
  
    doc.moveDown();
  
    // Table Header
    const tableTop = 220;
    const itemHeight = 25;
  
    doc
      .fontSize(12)
      .fillColor('white')
      .rect(50, tableTop, 500, itemHeight)
      .fill('#4B0082') // violet foncé
      .fillColor('white')
      .text('Description', 55, tableTop + 5)
      .text('Quantité', 200, tableTop + 5)
      .text('Prix Unitaire HT', 270, tableTop + 5)
      .text('TVA', 390, tableTop + 5)
      .text('Total HT', 450, tableTop + 5);
  
    doc.fillColor('black');
  
    let y = tableTop + itemHeight;
    let totalHT = 0;
    const tvaRate = 0.2;
  
    invoice.items.forEach(item => {
      const prixHT = item.price;
      const totalLigneHT = prixHT * item.quantity;
      totalHT += totalLigneHT;
  
      doc
        .fontSize(11)
        .text(item.product.name, 55, y)
        .text(item.quantity.toString(), 210, y)
        .text(`${prixHT.toFixed(2)} DA`, 270, y)
        .text(`20 %`, 400, y)
        .text(`${totalLigneHT.toFixed(2)} DA`, 450, y);
  
      y += 20;
    });
  
    const totalTVA = totalHT * tvaRate;
    const totalTTC = totalHT + totalTVA;
  
    y += 20;
  
    doc
      .fontSize(12)
      .text(`Montant Total HT: ${totalHT.toFixed(2)} DA`, 400, y);
    doc
      .text(`Total TVA: ${totalTVA.toFixed(2)} DA`, 400, y + 15)
      .font('Helvetica-Bold')
      .text(`Montant Total TTC: ${totalTTC.toFixed(2)} DA`, 400, y + 35);
  
    doc.end();
  }
  

  async generateInvoicePDF1(invoiceId: number, res: Response) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['items', 'items.product'],
    });
  
    if (!invoice) {
      res.status(404).send('Facture non trouvée');
      return;
    }
  
    const doc = new PDFDocument({ margin: 50 });
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture_${invoiceId}.pdf`);
  
    doc.pipe(res);
  
    doc.fontSize(20).text(`Facture : ${invoice.name}`);
    doc.moveDown();
    doc.text(`Date : ${invoice.date}`);
    doc.text(`Créée le : ${invoice.createdAt.toLocaleDateString()}`);
    doc.moveDown();
  
    doc.fontSize(14).text(`Produits :`);
    doc.moveDown();
  
    invoice.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.product.name} x ${item.quantity} → ${item.price} €`);
    });
  
    doc.moveDown();
  
    const total = Number(invoice.total);
    doc.fontSize(16).text(`Total : ${total.toFixed(2)} €`);
  
    // 👇 Ça finit le PDF (et ferme le stream automatiquement)
    doc.end();
  }

  async deleteInvoice(id: number) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items'], // Si tu as une relation entre Invoice et InvoiceItem
    });
  
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
  
    // Supprimer les InvoiceItems liés d'abord (optionnel selon config cascade)
    await this.invoiceItemRepository.delete({ invoice: { id } });
  
    // Ensuite supprimer la facture
    await this.invoiceRepository.delete(id);
  
    return { message: `Invoice ${id} deleted successfully` };
  }
  

  async generateInvoice(res: Response) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const fileName = `facture_${Date.now()}.pdf`;
    const filePath = `./invoices/${fileName}`;

    if (!fs.existsSync('./invoices')) {
      fs.mkdirSync('./invoices');
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(12).text('Nom de l’Entreprise', 200, 50);
    doc.text('Adresse');
    doc.text('Code Postal et Ville');
    doc.text('Numéro de téléphone');
    doc.text('Email');
    doc.moveDown();

    doc.text('Nom du client', 350, 50);
    doc.text('Adresse', 350);
    doc.text('Code Postal et Ville', 350);
    doc.text('Numéro de téléphone', 350);
    doc.text('Email', 350);
    doc.moveDown();

    //  Numéro de facture & Date
    doc.fontSize(14).text('Numéro de facture: 123456', 50, 150, { bold: true });
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    //  Objet de la facture
    doc.fontSize(12).text('Objet :Facture', 50, 200);
    doc.moveDown();

    //  TABLEAU Produits
    const items = [
      { description: 'Produit A', quantity: 1, unitPrice: 39.90, tva: 20 },
      { description: 'Produit B', quantity: 1, unitPrice: 19.90, tva: 20 },
    ];

    let startY = 250;
    doc.rect(50, startY, 500, 25).fill('#4B0082').stroke();
    doc.fillColor('white').text('Description', 55, startY + 7);
    doc.text('Quantité', 250, startY + 7);
    doc.text('Prix Unitaire HT', 320, startY + 7);
    doc.text('TVA', 420, startY + 7);
    doc.text('Total HT', 480, startY + 7);
    doc.fillColor('black');

    startY += 30;
    let totalHT = 0;
    let totalTVA = 0;

    items.forEach((item) => {
      const totalItemHT = item.quantity * item.unitPrice;
      const totalItemTVA = (totalItemHT * item.tva) / 100;

      doc.text(item.description, 55, startY);
      doc.text(item.quantity.toString(), 250, startY);
      doc.text(`${item.unitPrice.toFixed(2)} DA`, 320, startY);
      doc.text(`${item.tva} %`, 420, startY);
      doc.text(`${totalItemHT.toFixed(2)} DA`, 480, startY);

      totalHT += totalItemHT;
      totalTVA += totalItemTVA;
      startY += 20;
    });

    // Récapitulatif Montant
    const totalTTC = totalHT + totalTVA;
    startY += 30;
    doc.fontSize(12).text(`Montant Total HT: ${totalHT.toFixed(2)} DA`, 350, startY);
    doc.text(`Total TVA: ${totalTVA.toFixed(2)} DA`, 350, startY + 20);
    doc.font('Helvetica-Bold').text(`Montant Total TTC: ${totalTTC.toFixed(2)} DA`, 350, startY + 40);

    // Footer (Conditions de paiement)
    doc.fontSize(10).fillColor('gray').text(
      "Conditions de règlement : Paiement sous 30 jours...",
      50,
      startY + 100,
      { width: 500 }
    );

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        res.download(filePath, fileName, (err) => {
          if (err) reject(err);
          resolve(true);
        });
      });

      stream.on('error', reject);
    });
  }

  async findAll() {
    return this.invoiceRepository.find({
      relations: ['items', 'items.product'], // pour inclure les produits liés à chaque item
      order: { createdAt: 'DESC' },
    });
  }



  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      name: createInvoiceDto.name,
      date: createInvoiceDto.date,
      total: createInvoiceDto.total,
    });

    await this.invoiceRepository.save(invoice);

    // Ajouter les articles à la facture
    const items = createInvoiceDto.items.map(async (itemDto) => {
      const product = await this.productService.findById(itemDto.productId);

      if (!product) {
        throw new NotFoundException('Produit non trouvé');
      }

      const invoiceItem = this.invoiceItemRepository.create({
        invoice,
        product,
        quantity: itemDto.quantity,
        price: itemDto.price,
      });

      await this.invoiceItemRepository.save(invoiceItem);
    });

    await Promise.all(items);

    return invoice;
  }

}
