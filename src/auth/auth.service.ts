import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';



@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}


  
  async registerUser(userDto: CreateUserDto): Promise<User> {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
  
    // Prepare the basic userData object
    const userData: Partial<User> = {
      email: userDto.email,
      password: hashedPassword, // Set the hashed password
      role: UserRole.PATIENT, // If role exists, it will be set; otherwise, default will apply
      profile: userDto.profile, // Profile is always required
    };
  
    // Pass the populated userData to the UserService to create the user
    return this.usersService.create(userData);
  }

async validateUser(email: string, password: string): Promise<User | null> {
  // Use the 'findOne' method with relations to load the profile and doctorDetails
  const user = await this.usersService.findOne(email, { relations: ['profile'] });

  // If the user is found and the password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }

  // Return null if user not found or password doesn't match
  return null;
}


async login(user: User) {
  // Create the payload with the information that should be part of the token
  const payload = { email: user.email, sub: user.id };

  // Generate the access token using the payload
  const access_token = this.jwtService.sign(payload);

  // Remove the password from the user object before returning the data
  const { password, ...userWithoutPassword } = user;

  // Return the access token and user details (excluding password)
  return {
    access_token,
    user:userWithoutPassword,
  };
}
async validateToken(token: string) {
  try {
    // Decode and verify the token
    const decoded = this.jwtService.verify(token);
    console.log(decoded);
    
    // Fetch user details to include in the response
    const user = await  this.usersService.findOne(decoded.email ,  { relations: ['profile'] });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    // Return the decoded token payload along with user details
    return {
      ...userWithoutPassword
    };
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}
}
