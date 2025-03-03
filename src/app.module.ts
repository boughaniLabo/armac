import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { InvoiceModule } from './invoices/invoices.module';
import { ProductsModule } from './products/products.module';
import { Product } from './users/entities/product.entity';
import { OrderModule } from './orders/orders.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3300,
    username: 'root',
    password: 'boughani',
    database: 'armac',
    entities: [__dirname + '/**/*.entity{.ts,.js}',Product],
    synchronize: true,
    logging: true,

  }),
  UsersModule,
  InvoiceModule,ProductsModule,OrderModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
