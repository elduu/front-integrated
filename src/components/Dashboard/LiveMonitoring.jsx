import React, { useState, useEffect } from "react";

const LiveMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState([]);

  useEffect(() => {
    // Simulates adding new monitoring data every 5 seconds.
    const interval = setInterval(() => {
      setMonitoringData((prevData) => [
        ...prevData,
        {
          id: prevData.length + 1,
          activity: `Suspicious activity detected at ${new Date().toLocaleTimeString()}`,
        },
      ]);
    }, 5000);

    // Clean up the interval on component unmount.
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white shadow-lg p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Live Monitoring</h3>
      <ul className="space-y-2">
        {/* Show only the latest 5 entries */}
        {monitoringData.slice(-5).map((data) => (
          <li key={data.id} className="text-gray-700">
            {data.activity}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LiveMonitoring;

