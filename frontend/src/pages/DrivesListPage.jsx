import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddDriveModal from '../components/AddDriveModal';

const DrivesListPage = () => {
  const [drives, setDrives] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDrives = async () => {
    try {
      const response = await axios.get('/api/drives');
      setDrives(response.data);
    } catch (error) {
      console.error('Failed to fetch drives:', error);
      alert('Failed to fetch drives.');
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Placement Drives</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 text-white py-2 px-5 rounded-lg shadow-sm font-semibold hover:bg-teal-700"
          >
            Add Drive
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.length > 0 ? (
            drives.map(drive => (
              <Link to={`/drives/details/${drive._id}`} key={drive._id}>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-teal-500 transition-all h-full">
                  <h2 className="text-xl font-bold text-gray-900">{drive.companyName}</h2>
                  <p className="text-teal-700 font-semibold">{drive.jobTitle}</p>
                  <p className="text-sm text-gray-500 mt-2">CTC: {drive.salary}</p>
                  <p className="text-sm text-gray-500">Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</p>
                  <span className={`mt-4 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      drive.status === 'Active' ? 'bg-green-100 text-green-800' :
                      drive.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                    {drive.status}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p>No placement drives found. Click "Add Drive" to create one.</p>
          )}
        </div>
      </div>
      
      <AddDriveModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDriveAdded={fetchDrives}
      />
    </div>
  );
};

export default DrivesListPage;