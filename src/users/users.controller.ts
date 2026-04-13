/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  ValidationPipe,
  Ip,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '../../generated/prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@SkipThrottle()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  private readonly logger = new MyLoggerService(UsersController.name);

  @SkipThrottle({ default: false })
  @Get()
  findUsers(
    @Ip() ip: string,
    @Query('role') role?: 'ADMIN' | 'INTERN' | 'DEVELOPER',
  ) {
    this.logger.log(`Request for all Users\t${ip}`, UsersController.name);
    return this.userService.findUsers(role);
  }

  @Throttle({ short: { ttl: 1000, limit: 1 } })
  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUser(id);
  }

  @Post()
  create(@Body(ValidationPipe) user: Prisma.UserCreateInput) {
    return this.userService.create(user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) userUpdate: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(id, userUpdate);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
