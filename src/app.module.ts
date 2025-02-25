import { Module } from '@nestjs/common';
import { BucketModule } from './bucket/bucket.module';
import { DatabaseModule } from './database/database.module';
import { FileUploaderModule } from './file-uploader/file-uploader.module';

@Module({
  imports: [BucketModule, DatabaseModule, FileUploaderModule],
})
export class AppModule {}
