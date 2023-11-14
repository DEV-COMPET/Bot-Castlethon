import { google } from "googleapis";
import { partial_to_full_path } from "../../json";
import { env } from "@/env";
import { Either, left, right } from "@/api/@types/either"

interface CreateFolderRequest {
    folderName: string
    parentFolderId: string

}

type CreateFolderResponse = Either<
    { error: Error },
    { folderId: string }
>

export async function createFolder({ folderName, parentFolderId }: CreateFolderRequest): Promise<CreateFolderResponse> {
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app

    // const auth = new google.auth.GoogleAuth({
    //     keyFile: partial_to_full_path({
    //         dirname: __dirname,
    //         partialPath: `../../competente.${env.ENVIRONMENT}.json`
    //     }),
    //     scopes: 'https://www.googleapis.com/auth/drive',
    // });
    // const service = google.drive({ version: 'v3', auth });
    // const fileMetadata = {
    //     name: 'Invoices',
    //     mimeType: 'application/vnd.google-apps.folder',
    // };
    // const file = await service.files.create({
    //     requestBody: fileMetadata,
    //     fields: 'id',
    // });
    // console.log('Folder Id:', file.data.id);
    // return file.data.id

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: partial_to_full_path({
                dirname: __dirname,
                partialPath: `../competente.${env.ENVIRONMENT}.json`
            }),
            scopes: 'https://www.googleapis.com/auth/drive',
        });

        const drive = google.drive({ version: 'v3', auth });

        const folderMetadata = {
            name: folderName,
            parents: [parentFolderId],
            mimeType: 'application/vnd.google-apps.folder'
        };

        const folder = await drive.files.create({
            requestBody: folderMetadata,
            fields: 'id'
        });

        return right({ folderId: folder.data.id as string })

    } catch (error: any) {
        return left({ error })
    }
}
