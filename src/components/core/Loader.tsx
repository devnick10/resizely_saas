import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="min-h-screen min-w-full flex flex-col text-xl justify-center items-center">
      {" "}
      <span className="loading loading-spinner text-primary"></span>
      <h1>Loading</h1>
    </div>
  );
};
