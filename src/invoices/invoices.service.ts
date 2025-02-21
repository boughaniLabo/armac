import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { Response } from 'express';

@Injectable()
export class InvoicesService {
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
}
