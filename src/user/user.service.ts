import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { MessageBird } from 'messagebird/types';
import { MESSAGE_BIRD_CLIENT } from 'src/messagebird/constants';

export interface User {
  name: string;
  email: string;
  phone: string;
}

@Injectable()
export class UserService {
  constructor(
    @Inject(MESSAGE_BIRD_CLIENT) private msgClient: MessageBird,
    @InjectQueue('newuser') private readonly newUserQueue: Queue,
  ) {}
  async createUser() {
    const user = {
      name: 'bayo',
      email: 'bayo@gmial.ocm',
      phone: '+2349090604823',
    };
    // create new user

    //add send_otp job to new_user queue
    const res = await this.newUserQueue.add('send_otp', user);

    // const params = {
    //   originator: 'Msg Bird',
    //   recipients: ['+2349090604823'],
    //   body: 'this is a new message',
    // };

    // await this.msgClient.messages.create(params, function (err, response) {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log(response);
    // });

    return res;
  }
}
