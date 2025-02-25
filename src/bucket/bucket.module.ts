import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [BucketService]
})
export class BucketModule {}
