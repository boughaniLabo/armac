import { Controller, Get, Query, ParseFloatPipe } from '@nestjs/common';
import { UsersService } from './users.service';

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
}