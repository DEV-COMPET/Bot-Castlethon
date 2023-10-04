declare global {
  namespace NodeJs {
    interface ProcessEnv {
      MONGODB_PASSWORD: string;
      MONGODB_USER: string;
      DISCORD_GUILD_ID: string;
      DISCORD_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_PUBLIC_KEY: string;
      environment: "development" | "production" | "debug";
      PORT?: string;
    }
  }
}
export { }