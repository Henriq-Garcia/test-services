import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { DatabaseModule } from 'src/database/database.module';
import { Bucket } from './entity/bucket.emitter';

@Module({
  imports: [DatabaseModule],
  exports: [BucketService],
  providers: [BucketService, Bucket]
})
export class BucketModule {}
