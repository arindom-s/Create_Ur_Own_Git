import path from "node:path";
import zlib from "node:zlib";
import * as fs from "fs"

const args = process.argv.slice(2);
const command = args[0];

export function handleCatFileCommand(){
    const folder=args[2].substring(0,2);
    const file=args[2].substring(2);

    const completePath= path.join(process.cwd(), ".git", "objects", folder, file);

    const blob=fs.readFileSync(completePath);

    const decompressedBuffer=zlib.unzipSync(blob);

    const nullByteIndex=decompressedBuffer.indexOf(0);
    const blobContent=decompressedBuffer.subarray(nullByteIndex+1).toString();

    process.stdout.write(blobContent);
}