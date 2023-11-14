import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { Either, right } from "@/api/@types/either";
import { google } from "googleapis";
import { partial_to_full_path } from "@/bot/utils/json";
import { env } from "@/env";

interface CreateActivitysFolderInDriveRequest {
    name: string
}

type CreateActivitysFolderInDriveResponse = Either<
    { error: FetchReponseError },
    { folderName: string }
>

export async function createActivitysFolderInDrive({ name }: CreateActivitysFolderInDriveRequest): Promise<CreateActivitysFolderInDriveResponse> {

    const auth = new google.auth.GoogleAuth({
        keyFile: partial_to_full_path({
            dirname: __dirname,
            partialPath: `../competente.${env.ENVIRONMENT}.json`
        }),
        scopes: 'https://www.googleapis.com/auth/drive',
    });

    const drive = google.drive({ version: 'v3', auth });

    const folderMetadata = {
        name,
        parents: [env.DRIVE_ACTIVITIES_FOLDER_ID],
        mimeType: 'application/vnd.google-apps.folder'
    };

    const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id'
    });


    return right({ folderName: folder.data.name ?? "" })
}