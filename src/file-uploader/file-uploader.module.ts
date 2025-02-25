import { Module } from '@nestjs/common';
import { FileUploaderController } from './file-uploader.controller';
import { BucketModule } from 'src/bucket/bucket.module';

@Module({
  imports: [BucketModule],
  controllers: [FileUploaderController]
})
export class FileUploaderModule {}
