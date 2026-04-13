import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(readonly databaseservices: DatabaseService) {}

  async findUsers(role?: 'ADMIN' | 'INTERN' | 'DEVELOPER') {
    if (role)
      return this.databaseservices.user.findMany({
        where: {
          role,
        },
      });
    return this.databaseservices.user.findMany();
  }

  async findUser(id: number) {
    return this.databaseservices.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(user: Prisma.UserCreateInput) {
    return this.databaseservices.user.create({
      data: user,
    });
  }

  async update(id: number, updatedUser: Prisma.UserUpdateInput) {
    return this.databaseservices.user.update({
      where: {
        id,
      },
      data: updatedUser,
    });
  }

  async delete(id: number) {
    return this.databaseservices.user.delete({
      where: {
        id,
      },
    });
  }
}
