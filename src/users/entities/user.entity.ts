import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';
import { Product } from './product.entity';

export enum UserRole {
    PATIENT = 'user',
    MANAGER = 'manager',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    email?: string;

    @Column({ unique: true, nullable: true })
    name?: string;

    @Column()
    password?: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.MANAGER,
    })
    role: UserRole = UserRole.MANAGER;

    @Column({ default: true })
    isActive?: boolean;

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
    @JoinColumn()
    profile?: Profile;
    
    @OneToMany(() => Product, (product) => product.user)
    products: Product[];
}
