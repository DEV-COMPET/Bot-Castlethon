import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        name?: string,
        email: string,
        institution: string
    }

    const { email, institution, name }: InputFieldsRequest = Object.assign({}, ...input_data);


    return { email, institution, name }
}

export interface ExtractInputDataResponse {
    name?: string,
    email: string,
    institution: string
}
