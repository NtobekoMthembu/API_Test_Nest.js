import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles required, allow access
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    // Debug — remove after fixing
    console.log('User from token:', user);
    console.log('Required roles:', requiredRoles);

    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}