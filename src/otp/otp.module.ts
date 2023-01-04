import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { BullModule } from '@nestjs/bull';
import { OtpProcessor } from './consumers/otp.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'newuser',
    }),
  ],
  controllers: [OtpController],
  providers: [OtpService, OtpProcessor],
})
export class OtpModule {}
