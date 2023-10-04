import { PythonShell, PythonShellError } from 'python-shell';
import { execSync } from 'child_process';
import { talksDirectories } from './constants';
import { Either, left, right } from '@/api/@types/either';
import { formatarData } from '../formatting/formatarData';
import { ICreateCertificateProps, ITalksProps } from './interfaces';
import { ResourceNotFoundError } from '@/api/errors/resourceNotFoundError';
import { partial_to_full_path, readJsonFileRequest } from '../json';
import { PythonVenvNotActivatedError } from '@/bot/errors/pythonVenvNotActivatedError';
import { writeFile } from 'fs/promises'; // ou o módulo de arquivo que você estiver usando

type GetPythonPathResponse = Either<
  { error: ResourceNotFoundError },
  { python_path: string }
>

function getPythonPath(): GetPythonPathResponse {
  const isWin = process.platform === "win32";
  const isLinux = process.platform === "linux";

  if (isLinux)
    return right({ python_path: execSync('which python3').toString().trim() })

  if (isWin)
    return right({ python_path: 'python' })

  return left({ error: new ResourceNotFoundError("Operational System for Python") })
}

interface executePythonScriptRequest {
  args?: string[],
  pathRequest: readJsonFileRequest
}

type executePythonScriptResponse = Either<
  { error: ResourceNotFoundError | PythonShellError | PythonVenvNotActivatedError | Error },
  { response: string[] }
>

export async function executePythonScript({ args, pathRequest }: executePythonScriptRequest): Promise<executePythonScriptResponse> {

  if (!args) args = []

  const scriptPath = partial_to_full_path(pathRequest);

  const pythonPathResponse = getPythonPath();
  const pythonPath = pythonPathResponse.isRight() ? pythonPathResponse.value.python_path : "";

  if (pythonPathResponse.isLeft()) {
    return left({ error: pythonPathResponse.value.error });
  }

  const options = { pythonPath, args };

  try {
    const response = await PythonShell.run(scriptPath, options);
    if (!response)
      return left({ error: new PythonShellError() });

    return right({ response });

  } catch (error: any) {
    // console.error(error);
    if (error.message.includes("No module named 'reportlab'") || error.stack.includes("No module named 'reportlab'"))
      return left({ error: new PythonVenvNotActivatedError() });
    return left({ error: error })
  }
}
