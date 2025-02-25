import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { promises as fs } from 'fs';
import { PrismaService } from 'src/database/prisma.service';

@Processor('file-upload')
export class UploadProcessor {
    constructor(private prisma: PrismaService) {}

    @Process('processFile')
    async handleFileUpload(job: Job) {
        const { file_path, file_name } = job.data;

        let file = await this.findFile(file_name);
        if (!file) {
            file = await this.prisma.file.create({
                data: { file_name, status: 'PROCESSANDO' },
            });
        }

        try {
            const fileBuffer = await fs.readFile(file_path);

            const concurrency = 5;
            const chunks = Array.from(this.spliceBufferChunks(fileBuffer));

            for (let i = 0; i < chunks.length; i += concurrency) {
                const chunkGroup = chunks.slice(i, i + concurrency);

                await Promise.all(
                    chunkGroup.map((chunk, idx) =>
                        this.writeChunk(chunk, i + idx, file.id),
                    ),
                );
            }

            await this.prisma.file.update({
                where: { id: file.id },
                data: { status: 'FINALIZADO' },
            });
        } catch (error) {

        }

        try {
            await fs.unlink(file_path);
        } catch (unlinkError) {
            console.error(`Falha ao deletar o arquivo ${file_path}:`, unlinkError);
        }
    }

    private *spliceBufferChunks(buffer: Buffer) {
        const chunk_size = 32768;
        for (let i = 0; i < buffer.length; i += chunk_size) {
            yield buffer.subarray(i, i + chunk_size);
        }
    }

    private async writeChunk(chunk: Buffer, chunk_index: number, file_id: number) {
        await this.prisma.fileChunks.create({
            data: {
                chunk_index,
                data: chunk,
                file_id,
            },
        });
    }

    private findFile(file_name: string) {
        return this.prisma.file.findFirst({ where: { file_name } });
    }
}
