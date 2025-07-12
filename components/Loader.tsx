import React from "react";

function Loader() {
  return (
    <div className="min-h-screen min-w-full flex flex-col text-xl justify-center items-center">
      {" "}
      <span className="loading loading-spinner text-primary"></span>
      <h1>Loading</h1>
    </div>
  );
}

export default Loader;
