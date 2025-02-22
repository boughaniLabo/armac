import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() body: { name: string; price: number; quantity: number; userId: number; imageUrl?: string }
  ) {
    return this.productsService.createProduct(body.name, Number(body.price), Number(body.quantity), body.userId, body.imageUrl);
  }

  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }


  @Delete(':id')
async deleteProduct(@Param('id') id: number) {
  return this.productsService.deleteProduct(id);
}
}
