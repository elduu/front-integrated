import React from "react";

const Overview = () => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-blue-500 mb-4">Overview</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-lg font-bold">Active Alerts</h3>
          <p className="text-4xl text-blue-500">5</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-lg font-bold">Total Threats</h3>
          <p className="text-4xl text-blue-500">120</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-lg font-bold">Resolved Issues</h3>
          <p className="text-4xl text-blue-500">90</p>
        </div>
      </div>
    </section>
  );
};

export default Overview; // Ensure default export is here

