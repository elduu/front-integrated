import React from "react";
import Overview from "../components/Dashboard/Overview";
import AlertsTable from "../components/Dashboard/AlertsTable";
import AddAlert from "../components/Dashboard/AddAlert";
import LiveMonitoring from "../components/Dashboard/LiveMonitoring";
import ThreatsGraph from "../components/Dashboard/ThreatsGraph";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-lightBlue min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Dashboard</h1>
      <Overview />
      <ThreatsGraph />
      <LiveMonitoring />
      <AddAlert />
      <AlertsTable />
    </div>
  );
};

export default Dashboard;
