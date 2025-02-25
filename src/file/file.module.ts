import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [DatabaseModule, UploadModule],
  providers: [FileService],
  controllers: [FileController]
})
export class FileModule {}
