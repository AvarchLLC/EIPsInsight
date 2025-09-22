import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { env } from "@/env";
import { emailOTP, siwe } from "better-auth/plugins"
import { sendMail } from "@/lib/mailer";

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
        await sendMail({
          to: email,
          subject: "EIPsInsight Email Verification",
          text: `Welcome to EIPsInsight!\n\nYour one-time verification code is: ${otp}\n\nEnter this code to complete your sign-up.\n\nIf you did not request this, you can safely ignore this email.`,
          html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:auto;padding:24px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
          <h2 style="color:#6366f1;margin-bottom:12px;">Welcome to EIPsInsight!</h2>
          <p style="font-size:1.1rem;color:#374151;">Your one-time verification code is:</p>
          <div style="font-size:2rem;font-weight:700;letter-spacing:2px;color:#10b981;background:#f3f4f6;padding:12px 0;margin:18px 0 24px 0;border-radius:8px;">
            ${otp}
          </div>
          <p style="color:#64748b;">Enter this code to complete your sign-up.<br>If you did not request this, you can safely ignore this email.</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
          <div style="font-size:0.95rem;color:#94a3b8;">EIPsInsight &mdash; Ethereum Improvement Proposals Community</div>
        </div>
      `,
        });
      },
    }),
    ]
});