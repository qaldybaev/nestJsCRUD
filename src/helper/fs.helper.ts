import { Injectable } from "@nestjs/common";
import * as path from "node:path";
import * as fs from "node:fs";
import * as fsPromise from "node:fs/promises";

@Injectable()
export class FsHelper {
    async uploadFile(file: Express.Multer.File) {
        const fileFolder = path.join(process.cwd(), 'uploads');

        if (!fs.existsSync(fileFolder)) {
            fs.mkdirSync(fileFolder, { recursive: true });
        }

        let fileName = `${Date.now()}.${file.originalname.split('.')[1]}`;

        await fsPromise.writeFile(path.join(fileFolder, fileName), file.buffer);

        return {
            message: "success",
            fileUrl: path.join('uploads', fileName) 
        };
    }

    async deleteFile(filePath: string) {
        const absolutePath = path.join(process.cwd(), filePath);

        if (fs.existsSync(absolutePath)) {
            await fsPromise.unlink(absolutePath);
        }
    }
}
