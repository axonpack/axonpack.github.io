import { cn } from "@/lib/utils";

export const Card = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "rounded-lg border bg-card bg-gradient-to-b from-secondary/50 to-transparent p-6 text-card-foreground",
      className,
    )}
    {...props}
  />
);

export const CardTitle = ({ className, ...props }: React.ComponentProps<"h3">) => (
  <h3 className={cn("font-semibold tracking-tight", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
