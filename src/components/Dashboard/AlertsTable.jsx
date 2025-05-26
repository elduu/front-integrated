import React from "react";

const AlertsTable = () => {
  const alerts = [
    { id: 1, type: "DDoS", status: "Active", timestamp: "2024-12-08 12:45" },
    { id: 2, type: "Malware", status: "Resolved", timestamp: "2024-12-07 11:30" },
  ];

  return (
    <section>
      <h2 className="text-xl font-semibold text-blue-500 mb-4">Recent Alerts</h2>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-blue-500">ID</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-blue-500">Type</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-blue-500">Status</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-blue-500">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id} className="border-b">
              <td className="px-6 py-4">{alert.id}</td>
              <td className="px-6 py-4">{alert.type}</td>
              <td className={`px-6 py-4 ${alert.status === "Active" ? "text-red-500" : "text-green-500"}`}>
                {alert.status}
              </td>
              <td className="px-6 py-4">{alert.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AlertsTable;
