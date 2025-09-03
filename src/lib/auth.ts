import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { env } from "@/env";
import { emailOTP, siwe } from "better-auth/plugins"
import resend from "./resend";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders : {
        github : {
            clientId : env.GITHUB_CLIENT_ID!,
            clientSecret : env.GITHUB_CLIENT_SECRET!
        },
        google : {
            clientId : env.GOOGLE_CLIENT_ID!,
            clientSecret : env.GOOGLE_CLIENT_SECRET!
        }
    },
    plugins: [
        emailOTP({ 
            async sendVerificationOTP({ email, otp }) { 
                const { data, error } = await resend.emails.send({
                    from: 'EIPs Insight <onboarding@resend.dev>',
                    to: email,
                    subject: 'EIPs Insight - Verify your email',
                    html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
                }) 

            }, 
        }),
    ]
});