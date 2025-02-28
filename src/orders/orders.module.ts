import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './orders.controller';
import { Order } from 'src/users/entities/order.entity';
import { OrderItem } from 'src/users/entities/orderItem.entity';
import { Product } from 'src/users/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
