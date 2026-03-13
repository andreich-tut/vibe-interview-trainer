import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-1 text-xs font-bold",
  {
    variants: {
      variant: {
        default: "bg-[rgba(79,195,247,0.15)] text-[#4fc3f7]",
        secondary: "bg-[rgba(167,139,250,0.15)] text-[#a78bfa]",
        outline: "bg-[rgba(124,106,255,0.15)] text-primary",
        macro: "bg-[rgba(251,146,60,0.15)] text-[#fb923c]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
