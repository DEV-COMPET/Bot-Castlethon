import { Either, left, right } from "@/api/@types/either"
import { partial_to_full_path } from "@/bot/utils/json";
import { env } from "@/env";
import { google } from "googleapis";

interface DeleteActivityFolderRequest {
    id: string
}

type DeleteActivityFolderResponse = Either<
    { error: Error },
    { success: string }
>

export async function deleteActivityFolder({ id }: DeleteActivityFolderRequest): Promise<DeleteActivityFolderResponse> {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: partial_to_full_path({
                dirname: __dirname,
                partialPath: `../competente.${env.ENVIRONMENT}.json`
            }),
            scopes: 'https://www.googleapis.com/auth/drive',
        });

        const drive = google.drive({ version: 'v3', auth });

        console.dir({ id })

        await drive.files.delete({
            fileId: id
        });

        return right({ success: 'Folder deleted successfully' })

    } catch (error: any) {
        return left({ error })
    }
}