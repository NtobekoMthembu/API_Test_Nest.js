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
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { User, Role } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findUsers(@Query('role') role?: Role) {
    return this.userService.findUsers(role);
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  @Post()
  create(@Body(ValidationPipe) user: User) {
    return this.userService.create(user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatedUser: Partial<User>,
  ) {
    return this.userService.update(id, updatedUser);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
