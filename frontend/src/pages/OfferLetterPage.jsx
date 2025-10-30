import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Building2, User, CheckCircle2, AlertCircle, Download } from 'lucide-react';

const OfferLetterPage = () => {
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState('');
  // Prefill Moodle ID from logged-in user's email stored in localStorage.
  // If the email contains an '@', use the part before it (common username). Otherwise use the whole value.
  const initialMoodleId = (() => {
    try {
      const e = localStorage.getItem('userEmail');
      if (!e) return '';
      return e.includes('@') ? e.split('@')[0] : e;
    } catch {
      return '';
    }
  })();
  const [moodleId, setMoodleId] = useState(initialMoodleId);
  const [companyName, setCompanyName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadedLetter, setUploadedLetter] = useState(null);

  // Fetch offer letter for this student
  React.useEffect(() => {
    if (moodleId) {
      axios.get(`/api/offer-letter/student/${moodleId}`)
        .then(res => {
          setUploadedLetter(res.data);
        })
        .catch(() => {
          setUploadedLetter(null);
        });
    }
  }, [moodleId, success]);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !fullName || !moodleId || !companyName) {
      setError('Please fill all fields and upload your offer letter.');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('offerLetter', file);
      formData.append('fullName', fullName);
      formData.append('moodleId', moodleId);
      formData.append('companyName', companyName);
      await axios.post('/api/offer-letter/upload', formData);
      setSuccess(true);
      setFile(null);
      setFullName('');
      setMoodleId('');
      setCompanyName('');
      // Fetch the uploaded letter after upload
      axios.get(`/api/offer-letter/student/${moodleId}`)
        .then(res => setUploadedLetter(res.data))
        .catch(() => setUploadedLetter(null));
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Offer Letter</h2>
          <p className="text-gray-600">Submit your placement offer letter for verification</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div
              className="relative border-2 border-dashed border-teal-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-all duration-300 group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" id="offerLetterInput" />
              <label htmlFor="offerLetterInput" className="cursor-pointer text-center w-full">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-teal-600" />
                  </div>
                  {file ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-teal-700 font-semibold">
                        <FileText className="w-5 h-5" />
                        <span>{file.name}</span>
                      </div>
                      <p className="text-sm text-gray-500">Click to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-teal-600 font-semibold text-lg">Drag & drop or click to upload</p>
                      <p className="text-gray-500 text-sm">Supports PDF and image files</p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>

              {/* Moodle ID */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-semibold text-sm">ID</span>
                </div>
                <input
                  type="text"
                  placeholder="12345678"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                  value={moodleId}
                  onChange={e => setMoodleId(e.target.value)}
                />
              </div>

              {/* Company Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-700 text-sm font-medium">Offer letter uploaded successfully!</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3.5 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Offer Letter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Show uploaded offer letter if exists */}
        {uploadedLetter && uploadedLetter.fileUrl && (
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-teal-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Your Uploaded Offer Letter</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span className="font-medium">{uploadedLetter.companyName}</span>
                  </div>
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${uploadedLetter.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-teal-700 rounded-lg font-medium hover:bg-teal-50 transition-all duration-200 border border-teal-200 shadow-sm hover:shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>View Offer Letter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferLetterPage;
