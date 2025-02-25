import { Controller, Get, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('file')
export class FileController {

    constructor(private fileService: FileService) {}

    @Get('get/:file_name')
    async getFile(
        @Param('file_name') file_name: string, 
        @Res() res: Response,
    ) {
        const fileContent = await this.fileService.getFile(file_name);
        const mimeType = this.fileService.getMimeType(file_name);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${file_name}"`);

        res.send(fileContent);
    }

    @Get('status/:file_name')
    async getFileStatus(@Param('file_name') file_name: string) {
        return await this.fileService.verifyFileStatus(file_name);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './tmp',
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
            }
        })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return await this.fileService.uploadFile(file)
    }
}
