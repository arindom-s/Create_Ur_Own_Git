import * as fs from "fs";
import zlib from "zlib";
import path from "path";
const args = process.argv.slice(2);

export function handleTreeInspectCommand(){
    const flag=args[1];
    const commitSHA=args[2];

    if (!commitSHA) {
    throw new Error("Commit SHA is missing. Usage: ls-tree <commitSHA>");
    }
    const folder=commitSHA.slice(0,2);
    const file=commitSHA.slice(2);
    const folderPath=path.join(process.cwd(),".git","objects",folder);
    const filePath=path.join(folderPath,file);

    if(!fs.existsSync(folderPath))throw new Error(`Not a valid object name ${folderPath}`);
    if(!fs.existsSync(filePath))throw new Error(`Not a valid object name ${filePath}`);

    const fileContents=fs.readFileSync(filePath);
    // console.log(fileContents);

    const decompressed=zlib.inflateSync(fileContents);
    const output=decompressed.toString("utf8");

    const nullByteIdx=output.indexOf("\0");
    if(nullByteIdx===-1)throw new Error("Incorrect tree format");
    const content=output.slice(nullByteIdx+1);

    let result= "";
    let cursor= 0;

    while(cursor < content.length){
        const spaceIndex=content.indexOf(" ", cursor);
        if(spaceIndex === -1)break;

        const nullIndex=content.indexOf("\0",spaceIndex);
        if(nullIndex === -1)break;

        const fileName=content.slice(spaceIndex+1,nullIndex);
        result+=fileName + "\n";

        cursor = nullIndex + 21;
    }

    process.stdout.write(result)
}
