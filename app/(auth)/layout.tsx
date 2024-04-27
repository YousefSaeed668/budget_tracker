import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      <div className="mt-12">{children}</div>
    </div>
  );
};

export default layout;
