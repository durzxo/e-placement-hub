import React, { useState, useEffect } from 'react';

const DriveTracking = ({ setView }) => {
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    const driveData = [
      { id: 1, company: 'Google', role: 'Software Engineer', date: '2025-10-15', applicants: [
          { id: 101, name: 'Arnav Jadhav', rollNo: '001', branch: 'IT', status: 'Applied' },
          { id: 102, name: 'Chirkut Magan', rollNo: '003', branch: 'IT', status: 'Shortlisted' }
      ]},
      { id: 2, company: 'Microsoft', role: 'Data Scientist', date: '2025-10-25', applicants: [
          { id: 201, name: 'Babul Nath', rollNo: '002', branch: 'Computer', status: 'Applied' }
      ]}
    ];

    setTimeout(() => {
      setDrives(driveData);
    }, 1000);
  }, []);

  return (
    <div className="drive-tracking-container">
      <h2>Recruitment Drive Tracker</h2>
      <div className="drive-list">
        <h3>Available Drives</h3>
        <ul>
          {drives.map(drive => (
            <li key={drive.id} onClick={() => setSelectedDrive(drive)}>
              {drive.company} - {drive.role}
            </li>
          ))}
        </ul>
      </div>

      {selectedDrive && (
        <div className="applicant-list">
          <h3>Applicants for {selectedDrive.company} - {selectedDrive.role}</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Superset ID</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedDrive.applicants.map(applicant => (
                <tr key={applicant.id}>
                  <td>{applicant.name}</td>
                  <td>{applicant.rollNo}</td>
                  <td>{applicant.branch}</td>
                  <td>{applicant.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DriveTracking;