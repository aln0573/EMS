import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-400 border-t-blue-600"></div>
    </div>
  );
};

export default Loader;
