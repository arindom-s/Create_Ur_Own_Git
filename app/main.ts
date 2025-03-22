import * as fs from 'fs';
import { read } from 'node:fs';
import * as crypto from "crypto"
import path from 'node:path';
import { blob } from 'node:stream/consumers';
import zlib from 'node:zlib';


const args = process.argv.slice(2);
const command = args[0];


//commands


enum Commands {
    Init = "init",
    Cat = "cat-file",
    Hash= "hash-object",
    Tree= "ls-tree"
}

switch (command) {
    case Commands.Init:
        // You can use print statements as follows for debugging, they'll be visible when running tests.
        console.error("Logs from your program will appear here!");

        // Uncomment this block to pass the first stage
        fs.mkdirSync(".git", { recursive: true });
        fs.mkdirSync(".git/objects", { recursive: true });
        fs.mkdirSync(".git/refs", { recursive: true });
        fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
        console.log("Initialized git directory");
        break;

    case Commands.Cat:
         handleCatFileCommand();
         break;

    case Commands.Hash:
        handleHashCommand();
        break; 

    case Commands.Tree:
        handleTreeInspectCommand();
        break;

    default:
        throw new Error(`Unknown command ${command}`);
}

function handleCatFileCommand(){
    const folder=args[2].substring(0,2);
    const file=args[2].substring(2);

    const completePath= path.join(process.cwd(), ".git", "objects", folder, file);

    const blob=fs.readFileSync(completePath);

    const decompressedBuffer=zlib.unzipSync(blob);

    const nullByteIndex=decompressedBuffer.indexOf(0);
    const blobContent=decompressedBuffer.subarray(nullByteIndex+1).toString();

    process.stdout.write(blobContent);
}


function handleHashCommand(){
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

        const completeFolderPath= path.join(process.cwd(), ".git", "objects", folder);

        if(!fs.existsSync(completeFolderPath)){
            fs.mkdirSync(completeFolderPath, {recursive:true});
        }

        const compressedData=zlib.deflateSync(blob);
        fs.writeFileSync(path.join(completeFolderPath, file), compressedData);
         
    }
    process.stdout.write(hash);

}

function handleTreeInspectCommand(){
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