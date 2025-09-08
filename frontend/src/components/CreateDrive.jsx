import React, { useState } from 'react';

const CreateDrive = ({ setView }) => {
  const [driveDetails, setDriveDetails] = useState({
    companyName: '',
    jobRole: '',
    eligibilityCriteria: '',
    driveDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriveDetails({ ...driveDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Drive Details Submitted:", driveDetails);
  };

  return (
    <div className="create-drive-container">
      <h2>Create New Recruitment Drive</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={driveDetails.companyName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Job Role</label>
          <input
            type="text"
            name="jobRole"
            value={driveDetails.jobRole}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Eligibility Criteria (e.g., CGPA)</label>
          <input
            type="text"
            name="eligibilityCriteria"
            value={driveDetails.eligibilityCriteria}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Drive Date</label>
          <input
            type="date"
            name="driveDate"
            value={driveDetails.driveDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create Drive</button>
      </form>
    </div>
  );
};

export default CreateDrive;