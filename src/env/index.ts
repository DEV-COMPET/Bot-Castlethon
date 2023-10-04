import 'dotenv/config'; 
import { z } from 'zod'; 

const envSchema = z.object({

    DISCORD_GUILD_ID: z.string(),
    DISCORD_PUBLIC_KEY: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_TOKEN: z.string(),
    ENVIRONMENT: z.enum(["development" , "production" , "debug"]).default("development"),
    HOST: z.string().default("http://localhost:4444"),
    MONGODB_USER: z.string().optional(),
    MONGODB_PASSWORD: z.string().optional(),
    PORT: z.coerce.number().default(4444)
});

const _env = envSchema.safeParse(process.env); // tenta validar process.env para ver se tem as exatas informações dentro

if (_env.success === false) {
    console.error('Invalid environment variables',
        _env.error.format()); // formata todos os erros ali

    throw new Error('Invalid environment variables'); 
}

console.log("Environment Variables: valid")

export const env = _env.data

