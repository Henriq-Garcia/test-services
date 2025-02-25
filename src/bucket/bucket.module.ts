import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BucketService } from './bucket.service';
import { BucketProcessor } from './bucket.processor';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-upload',
    }),
    DatabaseModule
  ],
  providers: [BucketService, BucketProcessor],
  exports: [BucketService]
})
export class BucketModule {}
