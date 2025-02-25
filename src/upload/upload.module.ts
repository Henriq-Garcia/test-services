import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UploadProcessor } from './upload.processor'
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'file-upload' }),
    DatabaseModule
  ],
  exports: [BullModule.registerQueue({ name: 'file-upload' })],
  providers: [UploadProcessor],
})
export class UploadModule {}
