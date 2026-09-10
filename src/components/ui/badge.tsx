import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[0.7rem] font-medium",
  {
    variants: {
      variant: {
        default: "border-border bg-secondary text-subtle",
        mono: "border-border bg-secondary font-mono text-subtle",
        accent: "border-transparent bg-accent/12 text-accent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;
export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);
