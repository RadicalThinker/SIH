import React from "react";

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Student Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Mathematics</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">78%</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Science</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">85%</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Computer Science</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">72%</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Engagement Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Average Session Time</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">45 min</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Games Completed</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">156</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Active Students</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">42/45</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
