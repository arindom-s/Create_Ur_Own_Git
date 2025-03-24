import * as fs from "fs";
import path from "path";
import * as crypto from "crypto"
import zlib from "zlib"
const args = process.argv.slice(2);

export function handleHashCommand(){
    const filePath= args[2];
    const flag=args[1];

    if(!filePath){
        throw new Error(`Error: No file specified.`);
    }

    if(! fs.existsSync(filePath)){
        throw new Error(
            "could not open file path"
        );
    }

    const readingContents=fs.readFileSync(filePath);

    const fileLength=readingContents.length;

    const blobHeader=`blob ${fileLength}\0` ;

    const blob= Buffer.concat([Buffer.from(blobHeader), readingContents]);

    const hash= crypto.createHash("sha1").update(blob).digest('hex');

    if(flag==="-w" ){
        const folder=hash.slice(0,2);
        const file=hash.slice(2);

        const completeFolderPath= path.join(".git", "objects", folder);

        if(!fs.existsSync(completeFolderPath)){
            fs.mkdirSync(completeFolderPath, {recursive:true});
        }

        const compressedData=zlib.deflateSync(blob);
        fs.writeFileSync(path.join(completeFolderPath, file), compressedData);
         
    }
    process.stdout.write(hash);

}
