import path from 'path';
import { google } from 'googleapis';
import { FormInput, FormItemsId } from '../../typings/talks';
import { env } from "@/env";
import { Either, left, right } from '@/api/@types/either';
import { GoogleError } from '@/bot/errors/googleError';

const competTalksFormId = env.GOOGLE_FORM_ID;
const competTalksInscricaoFormId = env.GOOGLE_FORM_INSCRICAO_ID
const environment = env.ENVIRONMENT;

export function validateDriveLink(link: string): boolean {
    const regex =
        /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+(\/view)?(\?usp=share_link)?$/;
    return regex.test(link);
}

async function updateForm(formId: string, titulo: string, description: string) {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, `competente.${environment}.json`),
        scopes: 'https://www.googleapis.com/auth/drive',
    })
    const forms = google.forms({
        version: 'v1',
        auth
    })
    const createResponse = await forms.forms.batchUpdate({
        formId,
        requestBody: {
            requests: [
                {
                    updateItem: {
                        item: {
                            title: "O nome do Evento",
                            questionItem: {
                                question: {
                                    questionId: FormInput.EVENTO,
                                    required: true,
                                    choiceQuestion: {
                                        type: 'RADIO',
                                        options: [{ value: titulo }]
                                    }
                                }
                            },
                            itemId: FormItemsId.EVENTO
                        }, updateMask: "*",
                        location: {
                            index: 1
                        }
                    },
                },
                {
                    updateFormInfo: {
                        info: {
                            title: titulo,
                            description
                        },
                        updateMask: "*"
                    }
                }]
        }
    })
    return createResponse
}

async function updateInscricaoTalksForm(formId: string, titulo: string, description: string) {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, `competente.${environment}.json`),
        scopes: 'https://www.googleapis.com/auth/drive',
    })
    const forms = google.forms({
        version: 'v1',
        auth
    })
    const createResponse = await forms.forms.batchUpdate({
        formId,
        requestBody: {
            requests: [
                {
                    updateItem: {
                        item: {
                            title: "Nome do Evento",
                            questionItem: {
                                question: {
                                    questionId: FormInput.EVENTO,
                                    required: true,
                                    choiceQuestion: {
                                        type: 'RADIO',
                                        options: [{ value: titulo }]
                                    }
                                }
                            },
                            itemId: FormItemsId.EVENTO
                        }, updateMask: "*",
                        location: {
                            index: 1
                        }
                    },
                },
                {
                    updateFormInfo: {
                        info: {
                            title: titulo,
                            description
                        },
                        updateMask: "*"
                    }
                }]
        }
    })
    return createResponse
}

type UpdateTalksResponse = Either<
    { error: GoogleError },
    { sucess: boolean }
>

export async function updateTalks(titulo: string): Promise<UpdateTalksResponse> {

    const updateFormResponse = await updateForm(competTalksFormId, titulo, "Para que você possa receber o certificado de participação e poder utilizar como horas complementares, precisamos que você insira seus dados de acordo com o presente formulário.\n\nOBS: Os certificados serão entregues ao final do evento")

    if (!(200 <= updateFormResponse.status && updateFormResponse.status < 400))
        return left({ error: new GoogleError(updateFormResponse.statusText) })

    return right({ sucess: true })
}

export async function updateInscricaoTalks(titulo: string): Promise<UpdateTalksResponse> {

    const updateFormResponse = await updateInscricaoTalksForm(competTalksInscricaoFormId, titulo, "Dia: 28 de Setembro de 2023\nHorário: 19:00\nLocal: Auditório 201\n(Prédio 20) - Campus Nova Gameleira\n\nO Engenheiro de Soluções Sênior do GitHub, Pedro Lacerda estará conosco no COMPET Talk! Venha aprender um pouco mais sobre o GitHub Copilot, uma ferramenta de inteligência artificial que fornece sugestões de código para preenchimento automático em IDEs, como Visual Studio Code!\nMuuuito interessante, né?\n\nAguardamos por você!\n\nObs: Os certificados serão gerados para aqueles que preencherem o formulário de presença que será passado ao final da palestra.")

    if (!(200 <= updateFormResponse.status && updateFormResponse.status < 400))
        return left({ error: new GoogleError(updateFormResponse.statusText) })

    return right({ sucess: true })
}
