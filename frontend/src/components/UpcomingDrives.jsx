import React from 'react';
import { BsCalendarEvent } from 'react-icons/bs';

// The component already accepts drives as a prop, but we'll format the date
const UpcomingDrives = ({ drives }) => {
  return (
    <div className="card-container">
      <h3 className="card-title">Upcoming Drives</h3>
      <ul className="drives-list">
        {drives.map((drive) => (
          <li key={drive._id} className="drives-list-item">
            <BsCalendarEvent className="drives-list-item-icon" />
            <div>
              <p className="drive-company">{drive.companyName}</p>
              {/* Format the date nicely */}
              <p className="drive-date">{new Date(drive.driveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingDrives;