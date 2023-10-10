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
        name: string,
        institution: string
    }

    const { institution, name }: InputFieldsRequest = Object.assign({}, ...input_data);


    return { institution, name }
}

export interface ExtractInputDataResponse {
    name: string,
    institution: string
}
