import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SelectedStudentsPage = () => {
  const [data, setData] = useState({});
  const [editState, setEditState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyCounts, setCompanyCounts] = useState({});
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/dashboard/selected-students');
      setData(res.data);
      // Calculate counts
      const counts = {};
      let total = 0;
      Object.entries(res.data).forEach(([company, students]) => {
        counts[company] = students.length;
        total += students.length;
      });
      setCompanyCounts(counts);
      setTotalCount(total);
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleEdit = (company, studentId, value) => {
    setEditState(prev => ({
      ...prev,
      [`${company}_${studentId}`]: value
    }));
  };

  const handleSave = async (company, studentId) => {
    const packageValue = editState[`${company}_${studentId}`];
    if (packageValue === undefined) return;
    setLoading(true);
    setError('');
    try {
      await axios.patch('/api/dashboard/update-package', {
        studentId,
        company,
        packageValue
      });
      fetchData();
    } catch (err) {
      setError('Failed to update package');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Final Selected Students & Packages</h2>
      <div className="mb-4">
        <span className="font-semibold">Total Selected Students: </span>
        <span className="text-teal-700 font-bold">{totalCount}</span>
      </div>
      {Object.keys(companyCounts).length > 0 && (
        <div className="mb-6">
          <span className="font-semibold">Company-wise Selected Count:</span>
          <ul className="list-disc ml-6">
            {Object.entries(companyCounts).map(([company, count]) => (
              <li key={company}>
                <span className="font-medium">{company}:</span> <span className="text-teal-700 font-bold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {Object.keys(data).length === 0 && !loading ? (
        <div>No selected students found.</div>
      ) : (
        Object.entries(data).map(([company, students]) => (
          <div key={company} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">{company}</h3>
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Roll Number</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Package (₹)</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.studentId}>
                    <td className="border px-2 py-1">{student.name}</td>
                    <td className="border px-2 py-1">{student.rollNumber}</td>
                    <td className="border px-2 py-1">{student.email}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-24"
                        value={editState[`${company}_${student.studentId}`] ?? student.package ?? ''}
                        onChange={e => handleEdit(company, student.studentId, e.target.value)}
                        placeholder="Enter package"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => handleSave(company, student.studentId)}
                        disabled={loading}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default SelectedStudentsPage;
