import * as fs from 'fs';
import * as path from "path";

export interface readJsonFileRequest {
  dirname: string,
  partialPath: string
}

export function partial_to_full_path({ dirname, partialPath }: readJsonFileRequest): string {
  return path.join(dirname, partialPath);
}

export function readJsonFile({ dirname, partialPath }: readJsonFileRequest) {

  const filePath = partial_to_full_path({dirname, partialPath});

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const jsonObject = JSON.parse(jsonData);

    return jsonObject;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}


