import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { Response } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //  CREER UNE COMMANDE
  @Post()
  async createOrder(@Body() body: { userId: number; items: { productId: number; quantity: number }[] }) {
    return this.orderService.createOrder(body.userId, body.items);
  }

  //  OBTENIR LES COMMANDES D'UN UTILISATEUR
  @Get(':userId')
  async getUserOrders(@Param('userId') userId: number) {
    return this.orderService.getOrdersByUser(userId);
  }

  // TELECHARGER UNE FACTURE EN PDF
  @Get(':orderId/pdf')
  async downloadOrderPDF(@Param('orderId') orderId: number, @Res({ passthrough: true }) res: Response) {
    return this.orderService.generateOrderPDF(orderId, res);
  }
}
