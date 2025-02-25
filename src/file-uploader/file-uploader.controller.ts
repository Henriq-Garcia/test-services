import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BucketService } from 'src/bucket/bucket.service';

@Controller('file-uploader')
export class FileUploaderController {

    constructor (private bucketService: BucketService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        await this.bucketService.openUploadStream({file_name: file.originalname, buffer: file.buffer})
    }
}
