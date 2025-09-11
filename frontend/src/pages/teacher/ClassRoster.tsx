import React from "react";

const ClassRoster: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Class Roster</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
              <td className="px-6 py-4 whitespace-nowrap">8th</td>
              <td className="px-6 py-4 whitespace-nowrap">75%</td>
              <td className="px-6 py-4 whitespace-nowrap">2 hours ago</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
              <td className="px-6 py-4 whitespace-nowrap">7th</td>
              <td className="px-6 py-4 whitespace-nowrap">82%</td>
              <td className="px-6 py-4 whitespace-nowrap">1 day ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassRoster;
