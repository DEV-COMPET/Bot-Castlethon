import { google, youtube_v3 } from "googleapis";
import { env } from "@/env";
import path from 'path';

const environment = env.ENVIRONMENT;

export async function scheduleYoutubeVideo() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, `competente.${environment}.json`),
        scopes: 'https://www.googleapis.com/auth/youtube',
    })

    // Configuração da API do YouTube
    const youtube = google.youtube({
      version: 'v3',
      auth, // Use a chave de API para autenticação
    });
    
    // Define os parâmetros da transmissão ao vivo
    const liveBroadcastParams: youtube_v3.Params$Resource$Livebroadcasts$Insert = {
        part: ['snippet,status'],
        requestBody: {
          snippet: {
            title: 'Título da transmissão',
            scheduledStartTime: '2023-09-30T12:00:00Z', // Horário agendado em formato ISO 8601
          },
          status: {
            privacyStatus: 'unlisted', // Configure como desejar (unlisted, private, public)
          },
        },
      };
    
    // Agenda a transmissão ao vivo
    youtube.liveBroadcasts.insert(liveBroadcastParams, (err, response) => {
        if (err) {
          console.error('Erro ao agendar a transmissão:', err);
        } else if (response && response.data) {
          console.log('Transmissão agendada com sucesso:', response.data);
        } else {
          console.error('Resposta inesperada da API.');
        }
      });
}