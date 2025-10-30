import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Target, ArrowLeft } from 'lucide-react';
import FinalRoundSummaryModal from '../components/FinalRoundSummaryModal';

const DriveDetailPage = () => {
  const { id: driveId } = useParams();
  const [activeTab, setActiveTab] = useState('applicants');
  const [roundStatus, setRoundStatus] = useState({});
  const [roundStatusLoading, setRoundStatusLoading] = useState(false);
  useEffect(() => {
    if (!driveId) return;
    setRoundStatusLoading(true);
    axios.get(`/api/drives/${driveId}/round-status`).then(res => {
      setRoundStatus(res.data);
      setRoundStatusLoading(false);
    }).catch(() => setRoundStatusLoading(false));
  }, [driveId]);
  const [_enlargedImage, _setEnlargedImage] = useState(null);
  const [drive, setDrive] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState({});
  const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
  const [offerLetters, setOfferLetters] = useState({});

  const roundNames = ['aptitude', 'technical', 'hr', 'onlineAssessment', 'caseStudy', 'finalInterview', 'technicalTest', 'managerialRound', 'groupDiscussion', 'finalStatus'];
  const intermediateStatusOptions = ['Registered', 'Appeared', 'Cleared', 'Not Cleared', 'In Progress', 'N/A'];
  const finalStatusOptions = ['N/A', 'Pending', 'Selected', 'Not Selected'];

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
      console.error('Failed to fetch drive details:', error.response ? error.response.data : error.message);
      alert('Failed to load drive data. Ensure MongoDB is running and the drive ID is valid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driveId]);

  useEffect(() => {
    const fetchOfferLetters = async () => {
      if (!drive) return;
      try {
        const res = await axios.get(`/api/offer-letter/company/${drive.companyName}`);
        // Map offer letters by multiple keys for robust lookup: moodleId, rollNumber (Superset ID) and normalized fullName
        const map = {};
        const normalize = s => (s || '').toString().toLowerCase().trim();
        res.data.forEach(letter => {
          if (letter.moodleId) map[letter.moodleId] = letter;
          if (letter.rollNumber) map[letter.rollNumber] = letter;
          if (letter.fullName) map[`name:${normalize(letter.fullName)}`] = letter;
        });
        setOfferLetters(map);
      } catch {
        setOfferLetters({});
      }
    };
    fetchOfferLetters();
  }, [drive]);

  const fetchPrediction = async (studentId) => {
    if (predictions[studentId] && predictions[studentId] !== 'Error') return;
    setPredictions(prev => ({ ...prev, [studentId]: 'Loading...' }));
    try {
        const response = await axios.post(`/api/drives/predict`, { studentId, driveId });
        setPredictions(prev => ({ ...prev, [studentId]: `${response.data.prediction_score}%` }));
    } catch (error) {
        console.error('Prediction failed:', error.response ? error.response.data : error.message);
        setPredictions(prev => ({ ...prev, [studentId]: 'Error' }));
        alert(`Prediction Error: ${error.response?.data?.message || 'ML Service connection failed. Is the Python server running on port 8000?'}`);
    }
  };

  const handleStatusChange = async (studentId, roundName, newStatus) => {
    let shouldRefetch = false;
    setPredictions(prev => {
        const newPredictions = { ...prev };
        delete newPredictions[studentId]; 
        return newPredictions;
    });
    try {
        const currentRoundIndex = roundNames.indexOf(roundName);
        if (newStatus === 'Not Cleared' && roundName !== 'finalStatus') {
            shouldRefetch = true;
            const apiCalls = [axios.put(`/api/drives/${driveId}/applicants/${studentId}`, { roundName, status: newStatus })];
            for (let i = currentRoundIndex + 1; i < roundNames.length - 1; i++) {
                apiCalls.push(axios.put(`/api/drives/${driveId}/applicants/${studentId}`, { roundName: roundNames[i], status: 'N/A' }));
            }
            apiCalls.push(axios.put(`/api/drives/${driveId}/applicants/${studentId}`, { roundName: 'finalStatus', status: 'Not Selected' }));
            await Promise.all(apiCalls);
        } else {
            await axios.put(`/api/drives/${driveId}/applicants/${studentId}`, { roundName, status: newStatus });
        }
        if (shouldRefetch) {
            return fetchData(); 
        } else {
            setApplicants(prevApplicants =>
                prevApplicants.map(app =>
                    app.studentId === studentId
                        ? { ...app, activity: { ...app.activity, rounds: { ...app.activity.rounds, [roundName]: newStatus } } }
                        : app
                )
            );
        }
    } catch (error) {
        console.error('Failed to update status:', error);
        alert('Failed to update status.');
    }
  };

  const finalRoundClearedStudents = applicants.filter(
    (applicant) => applicant.activity?.rounds?.finalInterview === 'Cleared'
  );
  const clearedCount = finalRoundClearedStudents.length;

  if (loading) {
    return (
      <motion.div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        <motion.p className="ml-4 text-lg text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Loading drive details...
        </motion.p>
      </motion.div>
    );
  }

  if (!drive) {
    return (
      <motion.div className="p-8 text-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold">Drive not found.</h2>
      </motion.div>
    );
  }

  return (
    <motion.div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="max-w-full mx-auto px-4 lg:px-8">
        <div className="flex space-x-4 mb-6">
          <button className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'applicants' ? 'bg-teal-600 text-white shadow-lg transform scale-105' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'}`} onClick={() => setActiveTab('applicants')}>Applicants</button>
          <button className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'roundStatus' ? 'bg-teal-600 text-white shadow-lg transform scale-105' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'}`} onClick={() => setActiveTab('roundStatus')}>Round-wise Status</button>
        </div>
        {activeTab === 'applicants' ? (
          <>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Link to="/drives" className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-4 font-medium transition-colors duration-150">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to all drives
              </Link>
            </motion.div>
            <motion.div className="bg-white p-6 rounded-xl shadow-md mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{drive.companyName}</h1>
                  <h2 className="text-xl text-teal-700 font-semibold">{drive.jobTitle}</h2>
                  <p className="text-gray-600 mt-2">{drive.jobDescription}</p>
                </div>
                <button
                  onClick={() => setSummaryModalOpen(true)}
                  className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Summary
                </button>
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Applicants ({applicants.length})</h3>
            <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[150px] border-r border-gray-200">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Superset ID</th>
                      {roundNames.slice(0, -1).map(round => (<th key={round} className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">{round.replace(/([A-Z])/g, ' $1').trim()}</th>))}
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Final Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">ML Prediction</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Offer Letter</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applicants && applicants.length > 0 ? (
                      applicants.map((applicant, index) => (
                        <motion.tr key={applicant.studentId || index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">{applicant.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.rollNumber}</td>
                          {roundNames.slice(0, -1).map((round, i) => {
                            const status = applicant.activity?.rounds?.[round] || 'N/A';
                            const isPreviousNotCleared = roundNames.slice(0, i).some(prevRound => applicant.activity?.rounds?.[prevRound] === 'Not Cleared');
                            const isHighlightedNA = status === 'N/A' && isPreviousNotCleared;
                            return (<td key={round} className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]"><motion.select value={status} onChange={(e) => handleStatusChange(applicant.studentId, round, e.target.value)} className={`w-full p-2 border rounded-md text-xs transition-all duration-200 ${isHighlightedNA ? 'bg-red-50 text-red-600 border-red-300' : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'}`} disabled={isPreviousNotCleared}>{intermediateStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</motion.select></td>);
                          })}
                          <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]"><motion.select value={applicant.activity?.rounds?.finalStatus || 'N/A'} onChange={(e) => handleStatusChange(applicant.studentId, 'finalStatus', e.target.value)} className={`w-full p-2 border rounded-md text-xs focus:ring-2 transition-all duration-200 ${applicant.activity?.rounds?.finalStatus === 'Selected' ? 'bg-green-100 border-green-400 focus:ring-green-500' : applicant.activity?.rounds?.finalStatus === 'Not Selected' ? 'bg-red-100 border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}>{finalStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</motion.select></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">{(() => { const finalStatus = applicant.activity?.rounds?.finalStatus; if (finalStatus === 'Selected') { return <span className="font-bold text-green-600">100% (Selected)</span>; } if (finalStatus === 'Not Selected') { return <span className="font-bold text-red-600">0% (Not Selected)</span>; } if (predictions[applicant.studentId] === 'Loading...') { return <span className="text-gray-500">Calculating...</span>; } if (predictions[applicant.studentId] && predictions[applicant.studentId] !== 'Error') { const scoreText = predictions[applicant.studentId]; const score = parseFloat(scoreText); const colorClass = score > 90 ? 'text-green-600' : score > 70 ? 'text-yellow-600' : 'text-red-600'; return <span className={`font-bold ${colorClass}`}>{scoreText}</span>; } if (predictions[applicant.studentId] === 'Error') { return <span className="text-red-500 font-semibold">Error</span>; } return (<motion.button onClick={() => fetchPrediction(applicant.studentId)} className="inline-flex items-center text-xs font-semibold bg-purple-100 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors duration-150" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Target className="w-4 h-4 mr-1" />Predict</motion.button>); })()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">{
                            (() => {
                              let letter = null;
                              const tryNormalizeNameKey = (n) => `name:${n.toString().toLowerCase().trim()}`;
                              if (applicant.moodleId && offerLetters[applicant.moodleId]) {
                                letter = offerLetters[applicant.moodleId];
                              } else if (applicant.rollNumber && offerLetters[applicant.rollNumber]) {
                                letter = offerLetters[applicant.rollNumber];
                              } else if (applicant.name && offerLetters[tryNormalizeNameKey(applicant.name)]) {
                                letter = offerLetters[tryNormalizeNameKey(applicant.name)];
                              } else if (applicant.name) {
                                // fallback: try matching by exact fullName among values
                                letter = Object.values(offerLetters).find(l => l.fullName && l.fullName.toString().toLowerCase().trim() === applicant.name.toString().toLowerCase().trim());
                              }
                              if (letter && letter.fileUrl) {
                                const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                                const fileUrl = letter.fileUrl.startsWith('/uploads') ? `${backendBase}${letter.fileUrl}` : letter.fileUrl;
                                const isPdf = fileUrl.match(/\.pdf$/i);
                                if (isPdf) {
                                  return <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>;
                                } else {
                                  return <span className="text-gray-400">No Offer Letter</span>;
                                }
                              }
                              return <span className="text-gray-400">No Offer Letter</span>;
                            })()
                          }</td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr><td colSpan={roundNames.length + 3} className="px-6 py-8 text-center text-sm text-gray-500">No applicants found for this drive.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Round-wise Cleared Students</h3>
            {roundStatusLoading ? (
              <div>Loading round status...</div>
            ) : Object.keys(roundStatus).length === 0 ? (
              <div>No round status data available.</div>
            ) : (
              roundNames.map(round => {
                const clearedStudents = roundStatus[round] && roundStatus[round]['Cleared'] ? roundStatus[round]['Cleared'] : [];
                return (
                  <div key={round} className="mb-8">
                    <h4 className="text-lg font-semibold mb-2 text-teal-700">{round.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    {clearedStudents.length > 0 ? (
                      <ul className="space-y-1 ml-4">
                        {clearedStudents.map(student => (
                          typeof student === 'object' && student !== null && student.name ? (
                            <li key={student.studentId || student._id || student.name} className="text-sm text-gray-700">
                              {student.name} <span className="text-xs text-gray-500">({student.rollNumber || student.id || ''})</span>
                            </li>
                          ) : null
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-400 ml-4">No students cleared this round.</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      {isSummaryModalOpen && (
        <FinalRoundSummaryModal
          students={finalRoundClearedStudents.map(student => ({
            id: student.studentId,
            name: student.name,
            rollNo: student.rollNumber
          }))}
          onClose={() => setSummaryModalOpen(false)}
          count={clearedCount}
        />
      )}
      {_enlargedImage && (
        <></>
      )}
    </motion.div>
  );
};

export default DriveDetailPage;