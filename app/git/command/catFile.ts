// import path from "path";
// import * as zlib from "zlib";
// import * as fs from "fs";

// export class CatFileComm{
//     private flag: string;
//     private commitId: string;

//     constructor(flag:string,commitId:string){
//         this.flag=flag;
//         this.commitId=commitId;
//     }
//     execute():void{
//         const flag=this.flag;
//         const commitId=this.commitId;

//         switch(flag){
//             case "-p":
//                 {
//                     const folder=commitId.slice(0,2);
//                     const file=commitId.slice(2);

//                     const completePath= path.join(process.cwd(), ".git", "objects", folder, file);
//                     if(!fs.existsSync(completePath)){
//                         throw new Error(`not a valid object name ${commitId}`);
//                     } 

//                     const contents=fs.readFileSync(completePath);
//                     const outputBuffer= zlib.inflateSync(contents);

//                     const output=outputBuffer.toString();

//                     process.stdout.write(output);
//                 }

//             break;
//         }
//     }
// }