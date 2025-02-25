import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BucketService } from './bucket.service';

@Processor('file-upload')
export class BucketProcessor {
  constructor(private bucketService: BucketService) {}

  @Process('upload')
  async handleUpload(job: Job) {
    const data = job.data;
    await this.bucketService.processUpload(data);
  }
}
