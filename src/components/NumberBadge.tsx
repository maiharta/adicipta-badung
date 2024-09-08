import { cn } from "@/lib/utils";

export const NumberBadge = ({
  number,
  className,
  ...props
}: { number: number } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-primary text-primary-foreground w-6 h-6 rounded-full text-xs",
        className
      )}
      {...props}
    >
      {number}
    </div>
  );
};
