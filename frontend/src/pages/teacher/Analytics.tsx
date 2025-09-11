import React from "react";

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Student Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Mathematics</span>
              <span className="font-semibold">78%</span>
            </div>
            <div className="flex justify-between">
              <span>Science</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="flex justify-between">
              <span>Computer Science</span>
              <span className="font-semibold">72%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Engagement Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Average Session Time</span>
              <span className="font-semibold">45 min</span>
            </div>
            <div className="flex justify-between">
              <span>Games Completed</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex justify-between">
              <span>Active Students</span>
              <span className="font-semibold">42/45</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
