import * as fs from 'fs';

import { handleCatFileCommand } from './git/command/catFile';
import { handleHashCommand } from './git/command/hash_Object';
import { handleTreeInspectCommand } from './git/command/ls_tree';
import { handleWriteTreeCommand } from './git/command/write_tree';
import { handleCommitCommand } from './git/command/commit_tree';


const args = process.argv.slice(2);
const command = args[0];

enum Commands {
    Init = "init",
    Cat = "cat-file",
    Hash = "hash-object",
    Tree = "ls-tree",
    Write = "write-tree",
    Commit = "commit-tree"
}

switch (command) {
    case Commands.Init:
        console.error("Logs from your program will appear here!");
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

    case Commands.Write:
        handleWriteTreeCommand();
        break;

    case Commands.Commit:
        handleCommitCommand(args);
        break;

    default:
        throw new Error(`Unknown command ${command}`);
}

