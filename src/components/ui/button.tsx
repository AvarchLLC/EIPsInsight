import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#129490]/50 aria-invalid:ring-red-500/30 dark:aria-invalid:ring-red-500/50 border-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#129490] text-white border-[#093a3e] shadow-sm hover:bg-[#093a3e] hover:text-[#f8f6f2] active:scale-[0.97] dark:bg-[#093a3e] dark:text-[#f8f6f2] dark:border-[#129490] dark:hover:bg-[#129490] dark:hover:text-[#093a3e]",
        destructive:
          "bg-red-600 text-white border-red-800 shadow-sm hover:bg-red-700 dark:bg-red-700 dark:text-white dark:border-red-500",
        outline:
          "bg-[#f8f6f2] text-[#093a3e] border-[#093a3e] hover:bg-[#129490] hover:text-white dark:bg-[#093a3e] dark:text-[#f8f6f2] dark:border-[#129490] dark:hover:bg-[#129490] dark:hover:text-[#093a3e]",
        secondary:
          "bg-[#093a3e] text-[#f8f6f2] border-[#129490] hover:bg-[#129490] hover:text-[#093a3e]",
        ghost:
          "bg-transparent text-[#093a3e] border-transparent hover:bg-[#129490]/20 hover:text-[#129490]",
        link:
          "text-[#129490] underline underline-offset-4 border-0 hover:text-[#093a3e]",

        // Fun accents
        lime:
          "bg-lime-400 text-black border-2 border-[#093a3e] hover:bg-lime-300 active:scale-[0.97]",
        pink:
          "bg-pink-400 text-black border-2 border-[#093a3e] hover:bg-pink-300 active:scale-[0.97]",
        yellow:
          "bg-yellow-400 text-black border-2 border-[#093a3e] hover:bg-yellow-300 active:scale-[0.97]",
        blue:
          "bg-sky-400 text-black border-2 border-[#093a3e] hover:bg-sky-300 active:scale-[0.97]",

        metamask:
          "bg-[#f3c500] text-black tracking-wide border-2 border-[#093a3e] rounded-xl px-6 py-3 shadow-sm hover:bg-[#ffe066] active:scale-[0.97]",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
