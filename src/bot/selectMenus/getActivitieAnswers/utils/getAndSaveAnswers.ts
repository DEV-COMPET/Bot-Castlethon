import { uploadMetaToFolder } from "@/bot/utils/googleAPI/googleDrive/uploadMetaToFolder";
import { getLastResponseMeta, FileResponse, DriveResponse } from "./getLastResponseMeta";
import { DiscordError } from "@/bot/errors/discordError";
import { ActivityType } from "@/api/modules/activities/entities/activity.entity";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";
import { Either, left, right } from "@/api/@types/either";
import { createFolder } from "@/bot/utils/googleAPI/googleDrive/createFolder";
import { copyFromDriveLinkToDriveLink } from "@/bot/utils/googleAPI/googleDrive/copyFromDriveLinkToDriveLink";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";

interface GetAndSaveAnswersRequest {
    activity: ActivityType
    interaction: ExtendedStringSelectMenuInteraction
}

type GetAndSaveAnswersResponse = Either<
    { error: DiscordError },
    { answerStatus: AnswerStatus[], activityName: string }
>

type AnswerStatus = {
    teamName: string,
    type: "FILE" | "DRIVE" | "EMPTY"
}

export async function getAndSaveAnswers({ activity, interaction }: GetAndSaveAnswersRequest): Promise<GetAndSaveAnswersResponse> {

    const answerStatus: AnswerStatus[] = [];

    for (const channel of activity.chatMessagesIds) {

        const getLastResponseMetaResponse = await getLastResponseMeta({ interaction, refferenceMessageId: channel.messsageId, channelName: channel.textChannelName });
        if (getLastResponseMetaResponse.isLeft()) {
            return left({
                error: getLastResponseMetaResponse.value.error
            })
        }

        const { answer, teamName } = getLastResponseMetaResponse.value;

        // const saveAnswerOnDBResponse = await saveAnswerOnDB({ activityName: activity.name, teamName });
        const saveAnswerOnDBResponse = await fetchDataFromAPI({ 
            json: true, method: "POST", url: `/answer/`, bodyData: { teamName, activityName: activity.name } 
        });
        if (saveAnswerOnDBResponse.isLeft())
            return left({
                error: saveAnswerOnDBResponse.value.error
            })

        switch (answer.type) {
            case "DRIVE":

                const { link } = answer.data as DriveResponse;

                const createFolderResponse = await createFolder({ folderName: teamName, parentFolderId: activity.descriptionFileDir as string });
                if (createFolderResponse.isLeft()) {
                    return left({
                        error: createFolderResponse.value.error
                    })
                }

                console.dir({
                    destinLink: createFolderResponse.value.folderId, originLink: link
                
                })

                const copyFromDriveLinkToDriveLinkResponse = await copyFromDriveLinkToDriveLink({
                    destinLink: createFolderResponse.value.folderId, originLink: link
                })
                if (copyFromDriveLinkToDriveLinkResponse.isLeft()) {
                    return left({
                        error: copyFromDriveLinkToDriveLinkResponse.value.error
                    })
                }
                // await downloadFromFolderLink(link)

                answerStatus.push({ teamName, type: "DRIVE" })
                break;

            case "FILE":

                const { fileName, media } = answer.data as FileResponse;

                const createFolderResponseFile = await createFolder({ folderName: teamName, parentFolderId: activity.descriptionFileDir as string });
                if (createFolderResponseFile.isLeft()) {
                    return left({
                        error: createFolderResponseFile.value.error
                    })
                }

                const uploadToFolderResponse = await uploadMetaToFolder({ fileName, media, folderIdP: createFolderResponseFile.value.folderId });
                if (uploadToFolderResponse.isLeft()) {
                    return left({
                        error: uploadToFolderResponse.value.error
                    })
                }

                answerStatus.push({ teamName, type: "FILE" })
                break;

            case "EMPTY":
                answerStatus.push({ teamName, type: "EMPTY" })
                break;

            default:
                break;
        }
    }

    return right({ activityName: activity.name, answerStatus })
}