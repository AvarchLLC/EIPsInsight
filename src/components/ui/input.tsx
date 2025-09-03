import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border-2 px-3 py-2 text-base shadow-sm transition-colors outline-none",
        "bg-[#f8f6f2] text-[#093a3e] border-[#093a3e] placeholder:text-[#093a3e]/60 selection:bg-[#129490] selection:text-white",
        "focus:border-[#129490] focus:ring-2 focus:ring-[#129490]/50",
        "dark:bg-[#093a3e] dark:text-[#f8f6f2] dark:border-[#129490] dark:placeholder:text-[#f8f6f2]/60 dark:focus:border-[#129490] dark:focus:ring-[#129490]/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
