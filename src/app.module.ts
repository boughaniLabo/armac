import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { InvoiceModule } from './invoices/invoices.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'boughani',
    password: 'boughani',
    database: 'armac',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
  UsersModule,
  InvoiceModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
