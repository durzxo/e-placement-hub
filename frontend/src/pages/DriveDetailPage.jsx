import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DriveDetailPage = () => {
  const { id: driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const roundNames = ['aptitude', 'technical', 'hr', 'onlineAssessment', 'caseStudy', 'finalInterview', 'technicalTest', 'managerialRound', 'groupDiscussion', 'finalStatus'];
  const statusOptions = ['Registered', 'Appeared', 'Cleared', 'Not Cleared', 'In Progress', 'Selected', 'Not Selected', 'N/A'];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [driveRes, applicantsRes] = await Promise.all([
        axios.get(`/api/drives/${driveId}`),
        axios.get(`/api/drives/${driveId}/applicants`)
      ]);
      setDrive(driveRes.data);
      setApplicants(applicantsRes.data);
    } catch (error) {
      console.error('Failed to fetch drive details:', error);
      alert('Failed to load drive data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [driveId]);

  const handleStatusChange = async (studentId, roundName, newStatus) => {
    try {
      await axios.put(`/api/drives/${driveId}/applicants/${studentId}`, {
        roundName,
        status: newStatus,
      });
      setApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.studentId === studentId
            ? { ...app, activity: { ...app.activity, rounds: { ...app.activity.rounds, [roundName]: newStatus } } }
            : app
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status.');
    }
  };

  if (loading) return <div className="p-8">Loading drive details...</div>;
  if (!drive) return <div className="p-8">Drive not found.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto px-4 lg:px-8">
        <Link to="/drives" className="text-teal-600 hover:underline mb-4 inline-block">&larr; Back to all drives</Link>
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{drive.companyName}</h1>
          <h2 className="text-xl text-teal-700 font-semibold">{drive.jobTitle}</h2>
          <p className="text-gray-600 mt-2">{drive.jobDescription}</p>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Applicants</h3>
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                {roundNames.map(round => (
                  <th key={round} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{round.replace(/([A-Z])/g, ' $1')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map(applicant => (
                <tr key={applicant.studentId}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">{applicant.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{applicant.rollNumber}</td>
                  {roundNames.map(round => (
                    <td key={round} className="px-4 py-3 whitespace-nowrap text-sm">
                      <select
                        value={applicant.activity.rounds[round] || 'N/A'}
                        onChange={(e) => handleStatusChange(applicant.studentId, round, e.target.value)}
                        className="p-1 border rounded-md text-xs w-full focus:ring-teal-500 focus:border-teal-500"
                      >
                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriveDetailPage;