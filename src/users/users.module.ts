import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Assure-toi que User est bien déclaré
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule], //Ajoute cette ligne pour rendre User accessible à d'autres modules
})
export class UsersModule {}
