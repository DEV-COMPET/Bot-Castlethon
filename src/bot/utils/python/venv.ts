import { exec } from 'child_process';
import * as fs from 'fs';
import { partial_to_full_path } from '../json';

export function checkAndCreateVenv() {
    if (!fs.existsSync(partial_to_full_path({ dirname: __dirname, partialPath: '/venv' }))) {
        console.log("Criando ambiente virtual para Python");

        const createVenvCommand = `python3 -m venv ${'src/bot/utils/python/venv'}`;

        exec(createVenvCommand, (error, stderr) => {
            if (error) {
                console.error(`Erro ao criar ambiente virtual: ${error.message}`);
            } else if (stderr) {
                console.error(`stderr: ${stderr}`);
            } else {
                console.log('Ambiente virtual criado com sucesso.');
            }
        });

        while (!fs.existsSync(partial_to_full_path({ dirname: __dirname, partialPath: '/venv' }))) { }
        return;
    }
}

/*
function activateVenv() {
    const isWin = process.platform === "win32";
    const isLinux = process.platform === "linux";

    let command = "";

    if (isLinux) command = "source venv/bin/activate";
    if (isWin) command = "venv\\Scripts\\activate.bat";

    console.log("antes");

    // Use shell.exec to activate the virtual environment
    shell.exec(command, (code, stdout, stderr) => {
        if (code !== 0) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log("Ambiente virtual ativado com sucesso.");
    });
}
*/

checkAndCreateVenv()
// activateVenv() // TODO: arrumar isso se possível