import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { InvoiceModule } from './invoices/invoices.module';
import { ProductsModule } from './products/products.module';
import { Product } from './users/entities/product.entity';
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
  InvoiceModule,ProductsModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
