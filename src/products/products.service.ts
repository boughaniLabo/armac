import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/users/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProduct(name: string, price: number, quantity: number, userId: number, imageUrl?: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const product = this.productRepository.create({ name, price, quantity, user, imageUrl });
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['user'] });
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
  
    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
  
    await this.productRepository.remove(product);
    return { message: `Produit avec l'ID ${id} supprimé` };
  }
}
