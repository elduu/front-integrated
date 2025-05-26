import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-lightBlue min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to NIDS</h1>
      <p className="text-lg text-gray-700 mb-6">
        Network Intrusion Detection System – Monitor, Detect, and Respond to Cyber Threats in Real-Time.
      </p>
      <div className="space-x-4">
        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/login"
          className="bg-gray-100 text-blue-500 px-6 py-2 rounded hover:bg-gray-200"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
