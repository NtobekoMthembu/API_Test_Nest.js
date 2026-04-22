import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { User, Role } from './interfaces/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // ADMIN only — see all users
  @Get()
  @Roles('ADMIN')
  findUsers(@Query('role') role?: Role) {
    return this.userService.findUsers(role);
  }

  // Any logged in user — but can only see their own profile
  @Get(':id')
  async findUser(
    @Param('id') id: string,
    @Request() req,
  ) {
    if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
      throw new ForbiddenException(
        'You can only view your own profile',
      );
    }
    return this.userService.findUser(id);
  }

  // ADMIN only — create users
  @Post()
  @Roles('ADMIN')
  create(@Body(ValidationPipe) user: User) {
    return this.userService.create(user);
  }

  // ADMIN can update anyone, others can only update themselves
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatedUser: Partial<User>,
    @Request() req,
  ) {
    if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
      throw new ForbiddenException(
        'You can only update your own profile',
      );
    }
    return this.userService.update(id, updatedUser);
  }

  // ADMIN only — delete users
  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}