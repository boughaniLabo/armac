import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { InvoiceModule } from './invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3300, // ⚠️ Port de MySQL (vérifié sur l'image)
      username: 'root',
      password: 'boughani', // ⚠️ Ajoute le mot de passe correct ici
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
