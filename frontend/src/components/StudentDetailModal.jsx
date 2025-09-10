import React from 'react';

const StudentDetailModal = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full mx-4 my-8">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-150"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Details</h2>
          <p className="text-gray-500 mb-6">Roll No: {student.rollNumber}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="font-semibold text-gray-700">Name:</p>
              <p className="text-gray-900">{student.name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Branch:</p>
              <p className="text-gray-900">{student.branch}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">CGPA:</p>
              <p className="text-gray-900">{student.cgpa}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Email:</p>
              <p className="text-gray-900">{student.email}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Phone:</p>
              <p className="text-gray-900">{student.phone}</p>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Placement Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aptitude</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Online Assessment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Study</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Interview</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical Test</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Managerial Round</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Discussion</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {student.placementActivity.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.aptitude}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.technical}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.hr}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.onlineAssessment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.caseStudy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.finalInterview}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.technicalTest}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.managerialRound}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.rounds.groupDiscussion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{activity.rounds.finalStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;