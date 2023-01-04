import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'newuser',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
