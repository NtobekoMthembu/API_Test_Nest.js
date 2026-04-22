import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [FirebaseModule],
  controllers: [SessionsController],
  providers: [SessionsService, RolesGuard],
  exports: [SessionsService],
})
export class SessionsModule {}