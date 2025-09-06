import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockDrives } from '../data/mockDrives.js';
import { ArrowLeft, Upload, CheckSquare } from 'lucide-react';

const ManageDrivePage = () => {
  const { driveId } = useParams();
  const driveData = mockDrives.find(d => d.driveId === parseInt(driveId));

  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (driveData) {
      setStudents(driveData.registeredStudents);
    }
  }, [driveData]);

  const handleStatusChange = (studentId, round, newStatus) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, progress: { ...student.progress, [round]: newStatus } }
          : student
      )
    );
  };
  
  const handleFinalStatusChange = (studentId, newStatus) => {
     setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, finalStatus: newStatus }
          : student
      )
    );
  };

  if (!driveData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Drive not found.</h2>
        <Link to="/drives" className="text-teal-600 hover:underline mt-4 inline-block">
          Back to all drives
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link to="/drives" className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Drives
      </Link>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{driveData.companyName} - Drive Management</h1>
          <p className="text-lg text-gray-500 mt-1">Date: {driveData.driveDate}</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                <Upload className="w-5 h-5 mr-2" />
                Upload Students
            </button>
            <button className="flex items-center bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-700 transition-colors">
                <CheckSquare className="w-5 h-5 mr-2" />
                Bulk Update
            </button>
        </div> 
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Student Name</th>
              <th className="p-4 font-semibold text-gray-600">Roll No</th>
              {driveData.rounds.map(round => (
                <th key={round} className="p-4 font-semibold text-gray-600">{round} Status</th>
              ))}
              <th className="p-4 font-semibold text-gray-600">Final Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{student.name}</td>
                <td className="p-4 text-gray-600">{student.rollNumber}</td>
                {driveData.rounds.map(round => (
                  <td key={round} className="p-2">
                    <select
                      value={student.progress[round] || 'Registered'}
                      onChange={(e) => handleStatusChange(student.id, round, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option>Registered</option>
                      <option>Appeared</option>
                      <option>Cleared</option>
                      <option>Not Cleared</option>
                    </select>
                  </td>
                ))}
                <td className="p-2">
                    <select
                      value={student.finalStatus || 'Pending'}
                      onChange={(e) => handleFinalStatusChange(student.id, e.target.value)}
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:border-teal-500 ${student.finalStatus === 'Selected' ? 'bg-green-100 border-green-400 focus:ring-green-500' : student.finalStatus === 'Not Selected' ? 'bg-red-100 border-red-400 focus:ring-red-500' : 'border-gray-300'}`}
                    >
                      <option>Pending</option>
                      <option>Selected</option>
                      <option>Not Selected</option>
                    </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDrivePage;

