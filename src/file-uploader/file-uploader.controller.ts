import { Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BucketService } from 'src/bucket/bucket.service';

@Controller('file')
export class FileUploaderController {

    constructor (private bucketService: BucketService) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        await this.bucketService.openUploadStream({file_name: file.originalname, buffer: file.buffer})
    }

    @Get("download")
    async downloadFile(@Query("file_name") file: string, @Res() res: Response) {
        const fileBuffer = await this.bucketService.downloadFile(file);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${file}"`)
        res.send(fileBuffer)
    }
}
