import * as fs from 'fs';
import { GitClient } from './git/client';
import { CatFileComm } from './git/command/catFile';

const args = process.argv.slice(2);
const command = args[0];

const gitClient = new GitClient();

//commands


enum Commands {
    Init = "init",
    Cat = "cat-file"
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

    default:
        throw new Error(`Unknown command ${command}`);
}

function handleCatFileCommand(){
    const flag= args[1];
    const commitId=args[2];

    if(!flag || !commitId){
        console.error("Usage git-cat file error");
        process.exit(1);
    }

    console.log({command,flag,commitId});

    try{
        const catFileCommand = new CatFileComm(flag,commitId);
        catFileCommand.execute();
    }
    catch(error){
        console.error("Error");
        process.exit(1);
    }
}