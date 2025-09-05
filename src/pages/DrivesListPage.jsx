import React from 'react';
import { Link } from 'react-router-dom';
import { mockDrives } from '../data/mockDrives.js';
import { Eye, Edit, PlusCircle } from 'lucide-react';

const DrivesListPage = () => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Recruitment Drives</h1>
        <button className="flex items-center bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-700 transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Drive
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Company Name</th>
              <th className="p-4 font-semibold text-gray-600">Drive Date</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDrives.map((drive) => (
              <tr key={drive.driveId} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{drive.companyName}</td>
                <td className="p-4 text-gray-600">{drive.driveDate}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(drive.status)}`}>
                    {drive.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center gap-4">
                    <Link to={`/company/${drive.companyId}`} className="text-gray-500 hover:text-teal-600" title="View Company">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link to={`/drives/manage/${drive.driveId}`} className="text-gray-500 hover:text-teal-600" title="Manage Drive">
                      <Edit className="w-5 h-5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrivesListPage;

