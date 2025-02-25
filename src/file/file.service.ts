import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FileService {

    constructor (
        private prisma: PrismaService,
        @InjectQueue('file-upload') private fileQueue: Queue
    ) {}

    async uploadFile(file: Express.Multer.File) {
        await this.prisma.file.create({
            data: {
                file_name: file.originalname,
                status: 'PROCESSANDO'
            }
        });

        await this.fileQueue.add('processFile', {
            file_path: file.path,
            file_name: file.originalname
        });

        return { message: 'Upload Iniciado' }
    }

    async verifyFileStatus(file_name: string) {
        const file = await this.prisma.file.findUnique({ 
            where: { file_name },
            omit: {
                created_at: true,
                updated_at: true,
                id: true
            }
        });
        if (!file) throw new NotFoundException('Arquivo não encontrado');
        return file
    }

    async getFile(file_name: string) {
        const file = await this.prisma.file.findUnique({
            where: { file_name },
            include: { chunks: { orderBy: { chunk_index: 'asc' } } }
        });

        if (!file || !file.chunks.length) throw new NotFoundException('Arquivo não encontrado');

        return Buffer.concat(file.chunks.map((chunk) => chunk.data));
    }

    getMimeType(file_name: string): string {
        const ext = file_name.split(".").pop()!.toLowerCase()
        const mimeTypes: { [key: string] : string } = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            pdf: 'application/pdf',
            mp4: 'video/mp4',
            mp3: 'audio/mpeg',
            txt: 'text/plain',
        }
        return mimeTypes[ext] || 'application/octet-stream'
    }
}
