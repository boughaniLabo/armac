import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';




export class invoice {
    @PrimaryGeneratedColumn()
    id?: number;

   

    @Column({ unique: true, nullable: true })
    name?: string;

}
