import { google } from "googleapis";
import { partial_to_full_path } from "../../json";
import { env } from "@/env";
import { Either, left, right } from "@/api/@types/either";
import { GoogleError } from "@/bot/errors/googleError";

type UploadMetaToFolderResponse = Either<
    { error: Error },
    { file_id: string }
>

interface UploadMetaToFolderRequest {
    media: any,
    fileName: string
    folderIdP?: string | undefined
}

export async function uploadMetaToFolder({ media, fileName, folderIdP }: UploadMetaToFolderRequest): Promise<UploadMetaToFolderResponse> {
    const auth = new google.auth.GoogleAuth({
        keyFile: partial_to_full_path({
            dirname: __dirname,
            partialPath: `../competente.${env.ENVIRONMENT}.json`
        }),
        scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({ version: 'v3', auth });

    const folderId = folderIdP ? folderIdP : "12kwuE0lalYPWzcE6gCyYg0fTdXoT33eh"
    const fileMetadata = {
        name: fileName,
        parents: [folderId],
    };

    try {

        const file = await service.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        });

        if (!file.data.id) {
            return left({ error: new GoogleError("Erro na cruação do arquivo") })
        }

        return right({ file_id: file.data.id })

    } catch (error: any) {
        return left({ error: new GoogleError(error.message) })
    }
}