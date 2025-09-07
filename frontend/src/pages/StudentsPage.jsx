import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StudentDetailModal from '../components/StudentDetailModal';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const fileInputRef = useRef(null); // Ref for the hidden file input

  // Function to fetch students from the backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      alert('Failed to fetch students. Please try again.');
    }
  };

  // Fetch students when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Function to handle the "Upload" button click
  const handleUploadClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  // Function to handle the file selection and upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('masterlist', file); // 'masterlist' must match the backend upload.single() name

    try {
      const response = await axios.post('/api/students/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      fetchStudents(); // Refresh the student list after a successful upload
    } catch (error) {
      console.error('File upload failed:', error.response.data);
      alert(`Upload failed: ${error.response.data.message}`);
    } finally {
        // Clear the file input value so the user can upload the same file again if needed
        event.target.value = null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Students</h1>
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search by name or roll number..."
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".xlsx, .xls"
          />
          {/* The button the user sees */}
          <button 
            onClick={handleUploadClick}
            className="bg-teal-600 text-white py-2 px-4 rounded-lg shadow-sm font-semibold hover:bg-teal-700 ml-4"
          >
            Upload Master List
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Your table JSX is perfect, no changes needed here */}

<div className="bg-white rounded-xl shadow-md overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    {/* --- THIS IS THE PART THAT WAS LIKELY MISSING --- */}
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moodle ID</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    {/* --- THIS IS THE DYNAMIC PART THAT IS WORKING FOR YOU --- */}
    <tbody className="bg-white divide-y divide-gray-200">
      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => (
          <tr key={student._id}> {/* Use student._id from MongoDB */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.moodleID}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.cgpa}</td>
            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
              <button 
                className="text-teal-600 hover:text-teal-900 font-semibold"
                onClick={() => handleViewDetails(student)}
              >
                View Details
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No students found.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
        </div>
      </div>
      
      <StudentDetailModal 
        student={selectedStudent} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default StudentsPage; 