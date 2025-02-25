import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from 'src/database/prisma.service';
import { OpenUploadStreamDto } from './dto/open-upload-stream.dto';

@Injectable()
export class BucketService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('file-upload') private fileQueue: Queue,
  ) {}

  async openUploadStream(data: OpenUploadStreamDto) {
    await this.prisma.file.create({ data: { file_name: data.file_name, status: 'PROCESSANDO' } });

    this.fileQueue.add('upload', data);

    return { message: 'Upload iniciado, em processamento assíncrono.' };
  }

  async processUpload(data: OpenUploadStreamDto) {
    let index = 0;
    for (const chunk of this.spliceBuffer(data.buffer, data.options?.chunk_size)) {
      await this.writeChunks(chunk, index++, data.file_name);
    }

    await this.prisma.file.update({
      where: { file_name: data.file_name },
      data: { status: 'FINALIZADO' },
    });
  }

  private async writeChunks(chunk: Buffer, chunk_id: number, file_name: string) {
    const file = await this.findFile(file_name);
    if (!file) throw new Error('Arquivo não encontrado');

    await this.prisma.fileChunks.create({
      data: {
        chunk_index: chunk_id,
        data: chunk,
        file_id: file.id,
      },
    });
  }

  private async findFile(file_name: string) {
    return this.prisma.file.findFirst({ where: { file_name } });
  }

  private *spliceBuffer(buffer: Buffer, chunk_size: number = 8192) {
    for (let i = 0; i < buffer.length; i += chunk_size) {
      yield buffer.subarray(i, i + chunk_size);
    }
  }
}
