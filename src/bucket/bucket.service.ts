import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OpenUploadStreamDto } from './dto/open-upload-stream.dto';
import { Bucket } from './entity/bucket.emitter';

@Injectable()
export class BucketService {

    constructor (
        private prisma: PrismaService,
        private bucket: Bucket
    ) {
        bucket.on("write-chunk", this.writeChunks.bind(this))
    }

    async openUploadStream(data: OpenUploadStreamDto) {
        await this.prisma.file.create({ data: { file_name: data.file_name } })
        this.bucket.emit("upload", data)
    }

    private async writeChunks(chunk: Buffer, chunk_id: number, file_name: string) {
        const file = await this.findFile(file_name)
        if (!file) throw new NotFoundException('Arquivo não encontrado');
        await this.prisma.fileChunks.create({
            data: { 
                chunk_index: chunk_id,
                data: chunk,
                file_id: file.id
             }
        })

    }

    private async findFile(file_name: string) {
        const file = await this.prisma.file.findFirst({
            where: { file_name }
        })
        return file;
    }

    async downloadFile() {}
}
