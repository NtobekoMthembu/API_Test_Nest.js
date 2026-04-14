import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { DatabaseModule } from '../database/database.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
@Module({
  imports: [FirebaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
