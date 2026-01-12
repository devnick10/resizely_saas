import React from "react";
import { Spinner } from "./Spinner";

interface LoaderProps {
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({ label }) => {
  return (
    <div className="flex w-full max-w-xs items-center justify-center gap-2 text-xl">
      <Spinner />
      <span className="text-[16px]">{label ? label : "Loading"}</span>
    </div>
  );
};
