// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string, options?: { relations?: string[] }): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: options?.relations,  // Include relations if provided
    });

    return user;
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
  async searchUsersByDistance(
    name?: string, // Optional specific user name
    keyword?: string, // Optional general keyword for speciality
    latitude?: number, // Optional latitude for geolocation search
    longitude?: number, // Optional longitude for geolocation search
    radius?: number, // Optional radius for geolocation search
  ): Promise<User[]> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.doctorDetails', 'doctorDetails')
      .leftJoinAndSelect('doctorDetails.speciality', 'speciality')
      .where('user.role = :role', { role: UserRole.MANAGER }); // Always filter by role "DOCTOR"
  
    // Filter by name if provided
    if (name) {
      query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
  
    // Filter by keyword for speciality if provided
    if (keyword) {
      query.andWhere('speciality.name LIKE :keyword', { keyword: `%${keyword}%` });
    }
  
    // Filter by geolocation if latitude, longitude, and radius are provided
    if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
      query.andWhere(
        `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(doctorDetails.latitude))
            * cos(radians(doctorDetails.longitude) - radians(:longitude))
            + sin(radians(:latitude)) * sin(radians(doctorDetails.latitude))
          )
        ) <= :radius`,
        { latitude, longitude, radius },
      );
    }
  
    return query.getMany();
  }
//ajouter employer
  async addUser(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }
  
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }


  
  async deleteUser(id: number): Promise<{ message: string }> {
    const result = await this.usersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new Error(`Utilisateur avec l'ID ${id} non trouvé`);
    }
  
    return { message: `Utilisateur avec l'ID ${id} supprimé` };
  }
}
