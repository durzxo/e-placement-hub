// src/components/UpcomingDrives.jsx
import React from 'react';
import { BsCalendarEvent } from 'react-icons/bs';

const UpcomingDrives = ({ drives }) => {
  return (
    <div className="card-container">
      <h3 className="card-title">Upcoming Drives</h3>
      <ul className="drives-list">
        {drives.map((drive, index) => (
          <li key={index} className="drives-list-item">
            <BsCalendarEvent className="drives-list-item-icon" />
            <div>
              <p className="drive-company">{drive.company}</p>
              <p className="drive-date">{drive.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingDrives;