"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";


export default function VerifyRequestPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startVerification] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const isOtpComplete = otp.length === 6;

  function handleVerify() {
    // Handle OTP verification logic here
    startVerification(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            // Handle successful verification (e.g., redirect to dashboard)
            toast.success("Email verified successfully! Redirecting...");
            router.push("/");
          },
          onError: (error) => {
            // Handle verification error (e.g., show error message)
            toast.error(`Error verifying email/OTP: ${error.error.message}`);
          }
        }
      })
    });
  }
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email.</CardTitle>
        <CardDescription>We have sent you a verification email code to your email address. Please open the email and paste the code below</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="flex flex-col items-center space-y-2">
        <InputOTP maxLength={6} className="gap-2" value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSeparator/>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        </div>
        <div className="text-sm text-center text-muted-foreground mt-2">
          If you did not receive the email, please check your spam folder or{" "}
          <a href="/login" className="text-primary hover:underline">
            try logging in again
          </a>
          .
        </div>

        <Button onClick={handleVerify} disabled={emailPending || !isOtpComplete} className="w-full mt-4">
          {emailPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span> Loading ...</span>
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}