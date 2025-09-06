import React, { useState } from 'react';
import axios from 'axios';

const AddDriveModal = ({ isOpen, onClose, onDriveAdded }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    salary: '',
    jobLocation: 'Mumbai',
    minCGPA: '',
    driveDate: '',
    applicationDeadline: '',
    eligibilityCriteria: '',
    status: 'Upcoming'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/drives', formData);
      alert('Drive added successfully!');
      onDriveAdded(); // This will tell the parent page to refresh its list of drives
      onClose(); // This will close the modal
    } catch (error) {
      console.error('Failed to add drive:', error.response.data);
      alert(`Failed to add drive: ${error.response.data.message || 'Server Error'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Placement Drive</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="jobTitle" placeholder="Job Title" onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="salary" placeholder="Salary / CTC" onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="jobLocation" placeholder="Job Location" onChange={handleChange} required className="p-2 border rounded" />
            <input type="number" name="minCGPA" placeholder="Minimum CGPA" step="0.01" onChange={handleChange} required className="p-2 border rounded" />
            <select name="status" onChange={handleChange} value={formData.status} className="p-2 border rounded">
              <option value="Upcoming">Upcoming</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="Completed">Completed</option>
            </select>
            <div>
              <label className="block text-sm font-medium text-gray-700">Drive Date</label>
              <input type="date" name="driveDate" onChange={handleChange} required className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
              <input type="date" name="applicationDeadline" onChange={handleChange} required className="p-2 border rounded w-full" />
            </div>
          </div>
          <textarea name="jobDescription" placeholder="Job Description" rows="3" onChange={handleChange} required className="p-2 border rounded w-full"></textarea>
          <textarea name="eligibilityCriteria" placeholder="Eligibility Criteria (e.g., No active backlogs)" rows="2" onChange={handleChange} required className="p-2 border rounded w-full"></textarea>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="py-2 px-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">
              Add Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriveModal;