import { IsArray, IsInstance, IsInt, IsOptional, IsString } from "class-validator";
import { WriteStream } from "fs";

class UploadStreamOption {
    @IsOptional()
    @IsInt()
    chunk_size?: number

    @IsOptional()
    @IsString()
    content_type?: string

    @IsOptional()
    @IsArray()
    aliases?: string[]
}

export class OpenUploadStreamDto {
    @IsString()
    file_name: string;

    @IsInstance(Buffer)
    buffer: Buffer

    @IsOptional()
    @IsInstance(UploadStreamOption)
    options?: UploadStreamOption

}

