import { Injectable, NotFoundException, BadRequestException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/users/entities/order.entity';
import { OrderItem } from 'src/users/entities/orderItem.entity';
import { Product } from 'src/users/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { Response } from 'express';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // CREER UNE COMMANDE
  async createOrder(userId: number, items: { productId: number; quantity: number }[]): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Produit avec l'ID ${item.productId} non trouvé`);
      }

      if (product.quantity < item.quantity) {
        throw new BadRequestException(`Stock insuffisant pour le produit ${product.name}`);
      }

      // Mise à jour du stock
      product.quantity -= item.quantity;
      await this.productRepository.save(product);

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });

      totalPrice += orderItem.price;
      orderItems.push(await this.orderItemRepository.save(orderItem));
    }

    const order = this.orderRepository.create({
      user,
      orderItems,
      totalPrice,
      status: 'pending',
    });

    return this.orderRepository.save(order);
  }

  // OBTENIR LES COMMANDES D'UN UTILISATEUR
  async getOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  // GENERER UN PDF DE COMMANDE
  async generateOrderPDF(orderId: number, res: Response): Promise<StreamableFile> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    const folderPath = './orders_pdfs';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `commande_${order.id}.pdf`;
    const filePath = `${folderPath}/${fileName}`;

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 📜 En-tête du document
    doc.fontSize(18).text('Facture de Commande', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Client: ${order.user.name || order.user.email}`);
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`);
    doc.moveDown();

    // 🛍️ Tableau des produits
    doc.fontSize(14).text('Produits Commandés :', { underline: true });
    doc.moveDown();

    let startY = doc.y;
    doc.rect(50, startY, 500, 25).fill('#4B0082').stroke();
    doc.fillColor('white').text('Produit', 55, startY + 7);
    doc.text('Qté', 250, startY + 7);
    doc.text('Prix Unit.', 320, startY + 7);
    doc.text('Total', 420, startY + 7);
    doc.fillColor('black');
    startY += 30;

    order.orderItems.forEach((item) => {
      doc.text(item.product.name, 55, startY);
      doc.text(item.quantity.toString(), 250, startY);
      doc.text(`${item.product.price.toFixed(2)} DA`, 320, startY);
      doc.text(`${item.price.toFixed(2)} DA`, 420, startY);
      startY += 20;
    });

    doc.moveDown();
    const totalPrice = Number(order.totalPrice) || 0;
    doc.fontSize(16).text(`Total: ${totalPrice.toFixed(2)} DA`, { align: 'right' });

    // ✍️ Signature ou Note
    doc.moveDown();
    doc.fontSize(10).fillColor('gray').text(
      "Merci pour votre commande ! Veuillez nous contacter pour toute question.",
      50,
      startY + 50,
      { width: 500 }
    );

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        res.download(filePath, fileName, (err) => {
          if (err) reject(err);
          resolve(new StreamableFile(fs.createReadStream(filePath)));
        });
      });

      stream.on('error', reject);
    });
  }
}
