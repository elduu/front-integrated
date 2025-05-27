// NotificationsSection.jsx
import React, { useState } from "react";

const NotificationsSection = ({ notifications, markNotificationsRead, blockIP }) => {
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedNotificationId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="notifications-section p-6 bg-gray-900 rounded-lg shadow-md text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-orange-400">System Notifications</h2>
        <button
          onClick={markNotificationsRead}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded"
        >
          Mark All as Read
        </button>
      </div>

      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notification) => {
            const {
              id,
              type,
              timestamp,
              read,
              method,
              path,
              ip,
              attackType,
              violationCount,
              requestCount,
              findings,
            } = notification;

            const isExpanded = expandedNotificationId === id;

            return (
              <li
                key={id}
                className={`p-4 rounded-lg border transition duration-200 ${
                  read ? "border-gray-600 bg-gray-800" : "border-orange-500 bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold uppercase text-orange-300">
                    {type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(timestamp * 1000).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm mb-2">
                  {method} request to <code className="text-orange-300">{path}</code> -{" "}
                 <span className="text-yellow-400">
  {attackType === "BENIGN" ? "NORMAL" : attackType}
</span>
                </p>

                <button
                  onClick={() => toggleExpand(id)}
                  className="text-xs text-blue-400 hover:underline mb-2"
                >
                  {isExpanded ? "Hide Details" : "Show Details"}
                </button>

                {isExpanded && (
                  <div className="text-sm text-gray-300 space-y-1 mt-2">
                    <p><strong>IP:</strong> {ip}</p>
                    <p><strong>Violations:</strong> {violationCount}</p>
                    <p><strong>Requests:</strong> {requestCount}</p>
                    <p><strong>Findings:</strong> {findings?.join(", ") || "None"}</p>
                  </div>
                )}

                {ip !== "unknown" && (
                  <button
                    onClick={() => blockIP(ip)}
                    className="mt-3 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Block IP ({ip})
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400">No notifications available</p>
      )}
    </div>
  );
};

export default NotificationsSection;
