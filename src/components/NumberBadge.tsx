import { cn } from "@/lib/utils";

export const NumberBadge = ({
  number,
  className,
  ...props
}: { number: number } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-green-600 text-primary-foreground w-5 h-5 rounded-full text-xs",
        className
      )}
      {...props}
    >
      {number}
    </div>
  );
};
