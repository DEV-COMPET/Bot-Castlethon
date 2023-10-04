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
        nomes: string
        titulo: string
        minutos_totais: number
        email_assinante: string
        data_completa: string
    }

    const { nomes, titulo, data_completa, email_assinante, minutos_totais }: InputFieldsRequest = Object.assign({}, ...input_data);

    const minutos = Math.trunc(minutos_totais % 60).toString()
    const horas = Math.trunc(minutos_totais / 60).toString()

    const nomes_separados = nomes.split(',').map(nome => { return nome.trim() })

    return { nomes: nomes_separados, titulo, data_completa, email_assinante, horas, minutos }
}

interface ExtractInputDataResponse {
    nomes: string[]
    titulo: string
    minutos: string
    horas: string
    email_assinante: string
    data_completa: string
}
