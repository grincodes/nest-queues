import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';

import { MESSAGE_BIRD_CLIENT } from './constants';

@Module({})
export class MessagebirdModule {
  static forRoot(apikey: string): DynamicModule {
    console.log(apikey);

    const msgBirdProvider: Provider = {
      provide: MESSAGE_BIRD_CLIENT,
      useFactory: async () => {
        return import('messagebird').then((messagebird: any) => {
          const client = messagebird(apikey);
          return client;
        });
      },
    };
    return {
      module: MessagebirdModule,
      providers: [msgBirdProvider],
      exports: [msgBirdProvider],
      global: true,
    };
  }
}
