import React from 'react';
import './FinalRoundSummaryModal.css';

// The 'count' prop is received here
const FinalRoundSummaryModal = ({ students, onClose, count }) => {
  if (!students) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Final Round Cleared Students</h2>
            {/* This line displays the count */}
            <p className="student-count">{count} {count === 1 ? 'Student' : 'Students'}</p>
          </div>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {students.length > 0 ? (
            <ul className="student-list">
              {students.map((student) => (
                <li key={student.id} className="student-list-item">
                  <span className="student-name">{student.name}</span>
                  <span className="student-roll">Superset ID: {student.rollNo}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No students have cleared the final round yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalRoundSummaryModal;