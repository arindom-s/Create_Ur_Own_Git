import * as fs from "fs";
import * as crypto from "crypto";
import path from "path";
import zlib from "zlib";
const args=process.argv.slice(2);

function generateHash(bufferVal: Buffer, type:string, write:boolean){
     const header = `${type} ${bufferVal.length}\0`;
     const blobStore= Buffer.concat([Buffer.from(header), bufferVal]);
     const hash = crypto.createHash('sha1').update(blobStore).digest('hex');

     if(write===true){
        const folder=hash.slice(0,2);
        const file=hash.slice(2);

        const folderPath=path.join(process.cwd(), ".git", "objects", folder);
        const filePath=path.join(folderPath, file);

        fs.mkdirSync(folderPath, {recursive:true});
        fs.writeFileSync(filePath, zlib.deflateSync(blobStore));
     }
     return hash ;
}


function recursiveCreateTree(dir:string):string{
     let treeBuffer= Buffer.alloc(0);
     let entriesArr = [];
     let fileEntries = fs.readdirSync(dir,{withFileTypes:true})
     for(const entry of fileEntries){
        if(entry.name===".git")continue;

        let mode : string;
        let hash : string;

        const pathName = path.join(dir,entry.name);

        if(entry.isFile()){
            mode="100644";
            const fileContent = fs.readFileSync(pathName);
            hash = generateHash(fileContent, "blob", true);

        }
        else {
            mode="40000";
            hash= recursiveCreateTree(pathName);
        }

        entriesArr.push({
            mode:mode,
            hash : hash,
            name : entry.name
        })

    }

    entriesArr.sort((a, b) => a.name.localeCompare(b.name));


    for (const entry of entriesArr){
            const entryHash=Buffer.concat([Buffer.from(`${entry.mode} ${entry.name}\0`),
                Buffer.from(entry.hash, 'hex')
            ])
            treeBuffer=Buffer.concat([treeBuffer, entryHash]);
    }
    return generateHash(treeBuffer, "tree", true);
}

export function handleWriteTreeCommand(){
     const basePath=process.cwd();
     const treeHash = recursiveCreateTree(basePath);
     process.stdout.write(treeHash);
}