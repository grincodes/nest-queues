import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MessageBird } from 'messagebird';
import { MESSAGE_BIRD_CLIENT } from 'src/messagebird/constants';
import { User } from 'src/user/user.service';

@Processor('newuser') //handles a queue
export class OtpProcessor {
  private readonly logger = new Logger(OtpProcessor.name);
  constructor(@Inject(MESSAGE_BIRD_CLIENT) private msgClient: MessageBird) {}
  @Process('send_otp') //handles a job
  async sendOtp(job: Job<User>) {
    this.logger.debug('Preparing to send otp...');
    this.logger.debug(job.data);
    const res = await this.msgClient.verify.create(
      job.data.phone,
      {
        originator: 'Ds Otp Code',
        template: 'Your verification code is %token.',
        tokenLength: 6,
      },
      (err, response) => {
        if (err) {
          this.logger.debug(`Error : ${err}}`);
          return {
            error: err,
          };
        } else {
          this.logger.debug(response);
          this.logger.debug(`Otp Sent : ${response}}`);
          return {
            id: response.id,
          };
        }
      },
    );

    return res;
  }

  @OnQueueCompleted()
  onActive(job: Job) {
    this.logger.debug(` job ${job.id} completed ...`);
  }
}
