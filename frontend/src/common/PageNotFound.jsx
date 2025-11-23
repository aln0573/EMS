import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-6">
      <h1 className="text-8xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl mt-4 font-semibold text-gray-700">
        Page Not Found
      </h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for might have been removed,
        had its name changed, or is temporarily unavailable.
      </p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500"
        >
          Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
