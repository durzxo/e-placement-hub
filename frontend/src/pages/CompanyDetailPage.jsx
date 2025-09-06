import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockDrives } from '../data/mockDrives.js';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const CompanyDetailPage = () => {
  const { companyId } = useParams();
  const companyDrives = mockDrives.filter(d => d.companyId === parseInt(companyId));

  if (companyDrives.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Company not found.</h2>
        <Link to="/drives" className="text-teal-600 hover:underline mt-4 inline-block">
          Back to all drives
        </Link>
      </div>
    );
  }

  const companyDetails = companyDrives[0]; 

  return (
    <div className="p-8">
      <Link to="/drives" className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Drives
      </Link>
      
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
                 <h1 className="text-4xl font-bold text-gray-800">{companyDetails.companyName}</h1>
                 <a 
                    href={`http://${companyDetails.companyWebsite}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-teal-600 hover:underline mt-1"
                 >
                    {companyDetails.companyWebsite}
                    <ExternalLink className="w-4 h-4 ml-2"/>
                 </a>
            </div>
            <img src={companyDetails.companyLogo} alt={`${companyDetails.companyName} Logo`} className="h-12"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">About Company</h2>
                <p className="text-gray-600 leading-relaxed">{companyDetails.companyDescription}</p>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Drives Conducted</h2>
                 <ul className="space-y-3">
                    {companyDrives.map(drive => (
                        <li key={drive.driveId} className="p-3 bg-gray-50 rounded-lg border">
                           <p className="font-semibold text-gray-800">Drive Date: {drive.driveDate}</p>
                           <p className="text-sm text-gray-500">Status: {drive.status}</p>
                        </li>
                    ))}
                 </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;

