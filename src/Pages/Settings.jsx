import React, { useState } from "react";

const Settings = () => {
  const [theme, setTheme] = useState("Light");

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    alert(`Theme changed to ${e.target.value}`);
  };

  return (
    <div className="p-6 bg-lightBlue min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Settings</h1>
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Theme</label>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
