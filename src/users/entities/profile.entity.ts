import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'enum', enum: ['male', 'female'] })
    gender?: 'male' | 'female' | 'other';

    @Column({ type: 'date', nullable: true })
    dateOfBirth?: Date;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ type: 'text', nullable: true })
    medicalHistory?: string;

    @OneToOne(() => User, (user) => user.profile)
    user?: User;
}
