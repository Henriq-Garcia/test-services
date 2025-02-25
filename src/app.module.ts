import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { BullModule } from '@nestjs/bull';
import { UploadProcessor } from './upload/upload.processor';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    DatabaseModule,
    UploadModule,
    BullModule.forRoot({
      redis: { 
        host: process.env.REDIS_HOST, 
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
})
export class AppModule {}

