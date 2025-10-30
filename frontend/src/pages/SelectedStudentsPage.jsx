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
    } catch {
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
    } catch {
      setError('Failed to update package');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">Final Selected Students & Packages</h2>
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <span className="font-semibold text-gray-700">Total Selected Students: </span>
        <span className="text-teal-700 font-bold text-xl">{totalCount}</span>
      </div>
      {Object.keys(companyCounts).length > 0 && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <span className="font-semibold text-gray-700 block mb-3">Company-wise Selected Count:</span>
          <ul className="list-disc ml-6 space-y-1">
            {Object.entries(companyCounts).map(([company, count]) => (
              <li key={company}>
                <span className="font-medium text-gray-800">{company}:</span> <span className="text-teal-700 font-bold">{count}</span>
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
          <div key={company} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 bg-teal-600 text-white px-4 py-3">{company}</h3>
            <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Superset ID</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Package (₹)</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.studentId} className="hover:bg-teal-50 transition-colors duration-200">
                    <td className="border border-gray-200 px-4 py-3">{student.name}</td>
                    <td className="border border-gray-200 px-4 py-3">{student.rollNumber}</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{student.email}</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-3 py-2 w-32 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        value={editState[`${company}_${student.studentId}`] ?? student.package ?? ''}
                        onChange={e => handleEdit(company, student.studentId, e.target.value)}
                        placeholder="Enter package"
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <button
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default SelectedStudentsPage;
