import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal') // 
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true }) // Permettre l'absence d'image
  imageUrl?: string;

  @ManyToOne(() => User, (user) => user.products, { eager: true, onDelete: 'CASCADE' }) 
  user: User;
}
