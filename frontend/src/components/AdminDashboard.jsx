import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ setView }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentData = [
      { id: 1, name: 'Arnav Jadhav', rollNo: '001', branch: 'IT', cgpa: 9.2, status: 'Applied' },
      { id: 2, name: 'Babul Nath', rollNo: '002', branch: 'Computer', cgpa: 8.8, status: 'Interviewing' },
      { id: 3, name: 'Chirkut Magan', rollNo: '003', branch: 'IT', cgpa: 7.5, status: 'Rejected' }
    ];

    setTimeout(() => {
      setStudents(studentData);
    }, 1000);
  }, []);

  const [filters, setFilters] = useState({
    name: '',
    branch: '',
    minCgpa: ''
  });

  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      student.branch.toLowerCase().includes(filters.branch.toLowerCase()) &&
      student.cgpa >= (filters.minCgpa || 0)
    );
  });

  return (
    <div className="admin-dashboard">
      <h1>Student Database</h1>

      {/* Filter Section */}
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by branch..."
          value={filters.branch}
          onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min CGPA"
          value={filters.minCgpa}
          onChange={(e) => setFilters({ ...filters, minCgpa: e.target.value })}
        />
        <button>Apply Filters</button>
      </div>

      {/* Table Section */}
      <div className="student-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Superset ID</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.rollNo}</td>
                <td>{student.branch}</td>
                <td>{student.cgpa}</td>
                <td>{student.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;