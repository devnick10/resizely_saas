import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="flex min-h-screen min-w-full flex-col items-center justify-center text-xl">
      {" "}
      <span className="loading loading-spinner text-primary"></span>
      <h1>Loading</h1>
    </div>
  );
};
