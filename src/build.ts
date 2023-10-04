import { exec } from 'child_process';
import { executePythonScript } from './bot/utils/python';

function moveFiles() {
    const isWin = process.platform === "win32";
    const isLinux = process.platform === "linux";

    let command = ""

    if (isLinux)
        command = "rsync -r --include='*/' --include='*.json' --exclude='*' src/ dist/"

    if (isWin)
        command = `robocopy src dist *.json /e`;

    exec(command, (error, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
    });
}

async function moveBuild() {
    const response1 = await executePythonScript({
        pathRequest: {
            dirname: __dirname,
            partialPath: "build.py"
        }
    })

    console.log(response1)

    // const response2 = await executePythonScript({
    //     pathRequest: {
    //         dirname: __dirname,
    //         partialPath: "activate.py"
    //     }
    // })
// 
    // console.log(response2)
}

moveBuild()