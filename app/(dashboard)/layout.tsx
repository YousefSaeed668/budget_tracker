import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative h-screen w-full flex flex-col ">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default layout;
