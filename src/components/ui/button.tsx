import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:-translate-y-px hover:shadow-lg",
        outline: "border bg-card/60 hover:border-accent hover:text-accent",
        ghost: "hover:bg-secondary hover:text-foreground",
      },
      size: { default: "h-11 px-5", sm: "h-9 px-3", icon: "size-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;
export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);

type ButtonLinkProps = React.ComponentProps<"a"> & VariantProps<typeof buttonVariants>;
export const ButtonLink = ({ className, variant, size, ...props }: ButtonLinkProps) => (
  <a className={cn(buttonVariants({ variant, size }), className)} {...props} />
);

export { buttonVariants };
