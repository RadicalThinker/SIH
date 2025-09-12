import React from "react";

const ClassRoster: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Class Roster</h2>
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-800">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">John Doe</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">8th</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">75%</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">2 hours ago</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">Jane Smith</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">7th</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">82%</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">1 day ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassRoster;
