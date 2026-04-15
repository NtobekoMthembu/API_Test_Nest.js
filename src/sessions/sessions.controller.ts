import { Controller, Get, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAllSessions() {
    return this.sessionsService.findAllSessions();
  }

  @Get('active')
  findActiveSessions() {
    return this.sessionsService.findActiveSessions();
  }

  @Get('user/:id')
  findUserSessions(@Param('id') id: string) {
    return this.sessionsService.findUserSessions(id);
  }
}
