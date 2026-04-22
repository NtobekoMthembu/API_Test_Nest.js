import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  // ADMIN only — see all sessions
  @Get()
  @Roles('ADMIN')
  findAllSessions() {
    return this.sessionsService.findAllSessions();
  }

  // ADMIN only — see active sessions
  @Get('active')
  @Roles('ADMIN')
  findActiveSessions() {
    return this.sessionsService.findActiveSessions();
  }

  // Any logged in user — but DEVELOPER/INTERN can only see their own
  @Get('my-sessions')
  findMySessions(@Request() req) {
    return this.sessionsService.findUserSessions(req.user.userId);
  }

  // ADMIN can see anyone's sessions, others can only see their own
  @Get('user/:id')
  async findUserSessions(
    @Param('id') id: string,
    @Request() req,
  ) {
    if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
      throw new ForbiddenException(
        'You can only view your own sessions',
      );
    }
    return this.sessionsService.findUserSessions(id);
  }
}