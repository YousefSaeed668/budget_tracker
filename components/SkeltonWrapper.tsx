import { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const SkeltonWrapper = ({
  children,
  isLoading,
  fullWidth = true,
}: {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}) => {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0 pointer-events-none">{children}</div>
    </Skeleton>
  );
};

export default SkeltonWrapper;
