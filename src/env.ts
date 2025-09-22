import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    MONGODB_URI: z.string(),
    OPENPRS_MONGODB_URI: z.string(),
    OPENPRS_DATABASE: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string(),

    GITHUB_ACCESS_TOKEN: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    EMAIL_HOST: z.string().min(1),
    EMAIL_PORT: z.string().min(1).transform((val) => parseInt(val, 10)),
    EMAIL_USERNAME: z.string().min(1),
    EMAIL_PASSWORD: z.string().min(1),
    EMAIL_FROM: z.string(),

    RESEND_API_KEY: z.string(),
  },
  experimental__runtimeEnv: {
  },
});
