import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-4 py-10 text-center bg-[#FFFDF6] text-black">
      {/* 🔙 Back Button */}
      <Link
        href="/"
        className={buttonVariants({
          variant: "ghost",
          className: "absolute left-4 top-4 flex items-center gap-2",
        })}
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      {/* 🧾 Auth Card */}
      <div className="w-full max-w-sm flex flex-col gap-6">{children}</div>
      {/* 📜 Disclaimer */}
      <p className="mt-6 max-w-xs text-sm text-black/70 dark:text-[#f8f6f2]/70">
        By clicking{" "}
        <span className="font-semibold">"Continue with GitHub/Google"</span>, you agree to our{" "}
        <Link href="/terms" className="text-[#129490] dark:text-[#f8f6f2] hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#129490] dark:text-[#f8f6f2] hover:underline">
          Privacy Policy
        </Link>.
      </p>
    </div>
  );
}