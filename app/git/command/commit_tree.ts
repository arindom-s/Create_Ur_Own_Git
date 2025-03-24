import * as fs from "fs";
import path from "path";
import * as crypto from "crypto";
import zlib from "zlib"

export function handleCommitCommand(args:string[]){
    const treeSHA=args[1];
    const parentSHA=args[3];
    const commitMsg=args[5];

    const contentBuff=Buffer.concat([Buffer.from(`tree ${treeSHA}\n`), Buffer.from(`parent ${parentSHA}\n`), 
        Buffer.from(`author <Arindom@gmail.com> ${Date.now()} +0000\n`), 
        Buffer.from(`committer <Arindom@gmail.com> ${Date.now()} +0000\n\n`),
        Buffer.from(`${commitMsg}\n`)
    ]
    );

    const header = `commit ${contentBuff.length}\0` ;
    const data = Buffer.concat([Buffer.from(header),contentBuff]) ;

    const hash= crypto.createHash("sha1").update(data).digest('hex');
    const folder=hash.slice(0,2);
    const file=hash.slice(2);

    const completeFolderPath= path.join(".git", "objects", folder);

        if(!fs.existsSync(completeFolderPath)){
            fs.mkdirSync(completeFolderPath, {recursive:true});
        }

    const compressedData=zlib.deflateSync(data);
    fs.writeFileSync(path.join(completeFolderPath, file), compressedData);
         
    process.stdout.write(hash);

}