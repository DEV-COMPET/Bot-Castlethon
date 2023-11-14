import { drive_v3, google } from "googleapis";
import { partial_to_full_path } from "../../json";
import { env } from "@/env";
import fs from "fs";
import path from 'path';
import { Either, left, right } from "@/api/@types/either";

interface DownloadLocallyFromFolderLinkRequest {
    link: string
    folderDir: string
}

type DownloadLocallyFromFolderLinkResponse = Either<
    { error: Error },
    { folderId: string }
>

export async function downloadLocallyFromFolderLink({ folderDir, link }: DownloadLocallyFromFolderLinkRequest): Promise<DownloadLocallyFromFolderLinkResponse> {

    const regex = /(?<=folders\/)[^? \n\r\t]*/;
    const folderId = regex.exec(link)?.[0]
    if (!folderId)
        return left({ error: new Error("Link inválido") })


    const auth = new google.auth.GoogleAuth({
        keyFile: partial_to_full_path({
            dirname: __dirname,
            partialPath: `../competente.${env.ENVIRONMENT}.json`
        }),
        scopes: 'https://www.googleapis.com/auth/drive',
    });
    const drive = google.drive({ version: 'v3', auth });

    await downloadLocallyFromFolderLinkUtil(drive, folderId, folderDir)

    return right({ folderId })
}

async function downloadLocallyFromFolderLinkUtil(drive: drive_v3.Drive, folderId: string, folderPath: string) {

    const files = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType)',
    });

    if (files && files.data.files) {

        const fileList = files.data.files;

        for (const file of fileList) {

            if (file.mimeType === 'application/vnd.google-apps.folder') {
                const subFolderPath = `${folderPath}${file.name}/`;
                await downloadLocallyFromFolderLinkUtil(drive, file.id as string, subFolderPath);

            } else {

                const filePath = path.join(folderPath, file.name as string);

                const folder = path.dirname(filePath);
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }

                const dest = fs.createWriteStream(filePath);
                const response = await drive.files.get(
                    { fileId: file.id as string, alt: 'media' },
                    { responseType: 'stream' }
                );

                response.data.on('end', () => {
                    console.log(`Downloaded ${folderPath}${file.name}`);
                });

                response.data.pipe(dest);
            }
        }
    }
}

