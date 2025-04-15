


import { UsersModule } from './users/users.module';
import { InvoiceModule } from './invoices/invoices.module';
import { ProductsModule } from './products/products.module';
import { Product } from './users/entities/product.entity';
import { OrderModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'boughani',
    password: 'boughani',
    database: 'armac',
    entities: [__dirname + '/**/*.entity{.ts,.js}',Product],
    synchronize: true,
    logging: true,

  }),
  UsersModule,
  InvoiceModule,ProductsModule,OrderModule , 
  AuthModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
