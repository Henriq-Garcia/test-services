import { EventEmitter } from "stream";
import { OpenUploadStreamDto } from "../dto/open-upload-stream.dto";
import { Injectable } from "@nestjs/common";

interface BucketEvents {
    "upload": (data: OpenUploadStreamDto) => Promise<void> | void;
    "write-chunk": (chunk: Buffer, chunk_id: number, file_name: string) => Promise<void> | void;
}

@Injectable()
export class Bucket extends EventEmitter {

    async emitAsync<K extends keyof BucketEvents>(event: K, ...args: Parameters<BucketEvents[K]>): Promise<void> {
        const listeners = this.listeners(event) as BucketEvents[K][];
        await Promise.all(listeners.map(listener => (listener as (...args: any[]) => any)(...args)));
    }
    

    emit<K extends keyof BucketEvents>(event: K, ...args: Parameters<BucketEvents[K]>): boolean {
        return super.emit(event, ...args);
    }

    on<K extends keyof BucketEvents>(event: K, listener: BucketEvents[K]): this {
        return super.on(event, listener);
    }

    constructor () {
        super();
        this.on("upload", this.onUpload.bind(this))
    }

    async onUpload(data: OpenUploadStreamDto) {
        let index = 0;
        const promises: Promise<void>[] = [];
        for (const chunk of this.spliceBuffer(data.buffer, data.options?.chunk_size)) {
            promises.push(this.emitAsync('write-chunk', chunk, index++, data.file_name));
        }
        await Promise.all(promises);
    }

    private *spliceBuffer(buffer: Buffer, chunk_size: number = 2048) {
        for (let i = 0; i < buffer.length; i += chunk_size) {
            yield buffer.subarray(i, i + chunk_size)
        }
    }
}