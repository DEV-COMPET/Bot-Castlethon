import { env } from "@/env";

export function createURL(termination: string) {
    const URL = env.ENVIRONMENT === "development" ? 
        `http://localhost:${env.PORT}${termination}` : `${env.HOST}${termination}` || `http://localhost:${env.PORT}${termination}`;

    return URL
}