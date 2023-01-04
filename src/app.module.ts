import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MessagebirdModule } from './messagebird/messagebird.module';
import { OtpModule } from './otp/otp.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    OtpModule,
    UserModule,
    MessagebirdModule.forRoot(process.env.MESSAGEBIRD_API_KEY),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
