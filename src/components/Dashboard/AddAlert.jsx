import React, { useState } from "react";

const AddAlert = () => {
  const [alertData, setAlertData] = useState({
    type: "",
    status: "Active",
    timestamp: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlertData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`New Alert Added:\nType: ${alertData.type}\nStatus: ${alertData.status}`);
    // Here, you can also call an API to save the alert.
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
      <h3 className="text-lg font-bold mb-4">Add New Alert</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Alert Type</label>
          <input
            type="text"
            name="type"
            required
            className="w-full border rounded px-3 py-2"
            value={alertData.type}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            className="w-full border rounded px-3 py-2"
            value={alertData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Add Alert
        </button>
      </form>
    </div>
  );
};

export default AddAlert;
