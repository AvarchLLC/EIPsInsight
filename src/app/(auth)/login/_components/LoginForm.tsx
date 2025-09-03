"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export default function LoginForm() {
  const [githubPending, startGitHubPending] = useTransition();
  const [googlePending, startGooglePending] = useTransition();
  const [emailPending, startEmailPending] = useTransition();
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function signInWithGitHub() {
    startGitHubPending(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully signed in with GitHub! You'll be redirected shortly.");
          },
          onError: (error) => {
            toast.error(`Error signing in with GitHub: ${error.error.message}`);
          }
        }
      });
    });
  }

  async function signInWithGoogle() {
    startGooglePending(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onError: (error) => {
            toast.error(`Error signing in with Google: ${error.error.message}`);
          },
        }
      });
    });
  }

  async function signInWithEmail() {
    startEmailPending(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification email sent! Please check your inbox.");
            router.push(`/verify-request?email=${email}`);
          },
          onError: (error) => {
            toast.error(`Error sending verification email: ${error.error.message}`);
          }
        }
      })
    });
  }

  return (
    <Card className="bg-white dark:bg-[#093a3e] w-full text-center">
      {/* App Title */}
      <div className="text-3xl font-extrabold text-[#129490] dark:text-[#f8f6f2]">
        EIPs Insight
      </div>

      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-extrabold uppercase text-[#093a3e] dark:text-[#f8f6f2]">
          Welcome Back!
        </CardTitle>
        <CardDescription className="text-base text-[#093a3e]/80 dark:text-[#f8f6f2]/80">
          Please log in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-0">
        {/* GitHub Button */}
        <Button disabled={githubPending} onClick={signInWithGitHub} variant="default" className="w-full flex items-center justify-center gap-2">
          {githubPending ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span> Loading ...</span>
            </>
            ) : (
            <>
              <FaGithub className="h-5 w-5" />
              Continue with GitHub
            </>
          )}
        </Button>

        {/* Google Button */}
        <Button disabled={googlePending} onClick={signInWithGoogle} variant="default" className="w-full flex items-center justify-center gap-2">
          {googlePending ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span> Loading ...</span>
            </>
            ) : (
            <>
              <FaGoogle className="h-5 w-5" />
              Continue with Google
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative text-center text-sm text-black uppercase font-bold my-2">
          <div className="absolute inset-0 top-1/2 border-t border-black dark:border-[#129490]" />
          <span className="relative z-10 bg-white dark:bg-[#093a3e] px-3">
            Or continue with email
          </span>
        </div>

        {/* Email Login */}
        <div className="grid gap-4 text-left">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-semibold text-[#093a3e] dark:text-[#f8f6f2]">
              Email Address
            </Label>
            <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}  
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-[#f8f6f2] dark:bg-[#093a3e]"
              required
            />
          </div>
          <Button onClick={signInWithEmail} disabled={emailPending} variant="default" className="w-full">
            {emailPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span> Loading ...</span>
              </>
            ) : (
              <>
              <Send className="size-4"/>
              <span>Continue with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
