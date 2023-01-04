Bull a Queue system based on redis


After setting up the bull's root in the app module

to create a queue we need to register it in a module 

`@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  controllers: [AudioController],
  providers: [AudioProcessor],
})
export class AudioModule {}`


You can connect your queue to multiple redis instance ...
maybe to reduce load and scalability , to specify the different
instances of redis we userd named configuration on the bullFOrRoot

BullModule.forRoot('alternative-config', {
  redis: {
    port: 6381,
  },
});

In the example above, 'alternative-config' is just a configuration key (it can be any arbitrary string).

With this in place, you can now point to this configuration in the registerQueue() options object:


BullModule.registerQueue({
  configKey: 'alternative-queue'
  name: 'video',
});

# Producers 
Job producers add jobs to the queue. poducers are setup in nest providers {use service , but they can be userd in other regisetered providers as well as controllers}

To add jobs to a queue, first inject the queue into the service as follows:
 `constructor(@InjectQueue('audio') private audioQueue: Queue) {}`@
@InjectQueue()
The @InjectQueue() decorator identifies the queue by its name, as provided in the registerQueue() method call (e.g., 'audio').

Now, add a job by calling the queue's add() method, passing a user-defined job object. Jobs are represented as serializable JavaScript objects (since that is how they are stored in the Redis database). The shape of the job you pass is arbitrary; use it to represent the semantics of your job object.


const job = await this.audioQueue.add({
  foo: 'bar',
});

# Named jobs
Jobs may have unique names. This allows you to create specialized consumers that will only process jobs with a given name.


const job = await this.audioQueue.add('transcode', {
  foo: 'bar',
});

# Consumers
consumers listen to queue or events, this is done is by creating a class and defining method that 
does that.


A consumer is a class defining methods that either process jobs added into the queue, or listen for events on the queue, or both. Declare a consumer class using the @Processor() decorator as follows:

@Processor() attaches a queue to a class
@Process() is use to define handler for a specific job on a queue

`@Processor('audio')
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);

  @Process('transcode')
  handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}`

HINT
Consumers must be registered as providers so the @nestjs/bull package can pick them up.

## Queue Events 
You can listen to queue events to ger updates on the status of the queue .
For example you can get notified when there is an error on the queue or when the queue is active.

For events there are of 2 types ; local and global 
local event are events of queues on the same process while global is for distributed queues
decorators for local events are different from decorators on global. @onGlobal-${event} is used to 
listen to global events

@OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
