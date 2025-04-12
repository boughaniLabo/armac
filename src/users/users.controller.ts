import { Controller, Get, Query, ParseFloatPipe, Post, Body, Delete, ParseIntPipe, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  async search(
    @Query('name') name?: string,
    @Query('keyword') keyword?: string,
    @Query('latitude') latitude?: string, // No ParseFloatPipe yet
    @Query('longitude') longitude?: string, // No ParseFloatPipe yet
    @Query('radius') radius?: string, // No ParseFloatPipe yet
  ) {
    // Parse only if the parameter is present
    const parsedLatitude = latitude ? parseFloat(latitude) : undefined;
    const parsedLongitude = longitude ? parseFloat(longitude) : undefined;
    const parsedRadius = radius ? parseFloat(radius) : undefined;

    return this.usersService.searchUsersByDistance(
      name,
      keyword,
      parsedLatitude,
      parsedLongitude,
      parsedRadius,
    );
  }


  @Post('add')
  async addUser(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.addUser(userData);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

}