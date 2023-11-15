import { drive_v3, google } from "googleapis";
import { partial_to_full_path } from "../../json";
import { env } from "@/env";
import { uploadMetaToFolder } from "./uploadMetaToFolder";
import { Either, left, right } from "@/api/@types/either";

interface CopyFromDriveLinkToDriveLinkRequest {
    originLink: string
    destinLink: string
}

type CopyFromDriveLinkToDriveLinkResponse = Either<
    { error: Error },
    { destinId: string }
>

export async function copyFromDriveLinkToDriveLink({ originLink, destinLink }: CopyFromDriveLinkToDriveLinkRequest): Promise<CopyFromDriveLinkToDriveLinkResponse> {

    const regex = /(?<=folders\/)[^? \n\r\t]*/;

    const destinId = destinLink

    const originId = regex.exec(originLink)?.[0]
    if (!originId)
        return left({ error: new Error("Link de origem inválido") })

    const auth = new google.auth.GoogleAuth({
        keyFile: partial_to_full_path({
            dirname: __dirname,
            partialPath: `../competente.${env.ENVIRONMENT}.json`
        }),
        scopes: 'https://www.googleapis.com/auth/drive',
    });

    const drive = google.drive({ version: 'v3', auth });

    await copyFromDriveLinkToDriveLinkUtil(drive, originId, destinId)
    return right({ destinId })
}

async function copyFromDriveLinkToDriveLinkUtil(drive: drive_v3.Drive, folderId: string, destinFolderId: string) {

    const files = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType)',
    });

    if (files && files.data.files) {

        const fileList = files.data.files;

        for (const file of fileList) {

            if (file.mimeType === 'application/vnd.google-apps.folder') {

                const folderMetadata = {
                    name: file.name,
                    parents: [destinFolderId],
                    mimeType: 'application/vnd.google-apps.folder'
                };

                const folder = await drive.files.create({
                    requestBody: folderMetadata,
                    fields: 'id'
                });

                await copyFromDriveLinkToDriveLinkUtil(drive, file.id as string, folder.data.id as string);

            } else {

                const response = await drive.files.get(
                    { fileId: file.id as string, alt: 'media' },
                    { responseType: 'stream' }
                );
                
                const media = {
                    mimeType: file.mimeType,
                    body: response.data
                };

                await uploadMetaToFolder({ media, fileName: file.name as string, folderIdP: destinFolderId })
            }
        }
    }
}
