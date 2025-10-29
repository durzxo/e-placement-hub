import React, { useState } from 'react';
import axios from 'axios';

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
    } catch (err) {
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
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">Upload Offer Letter</h2>
      <form onSubmit={handleSubmit}>
        <div
          className="border-2 border-dashed border-teal-400 rounded-lg p-6 mb-4 flex flex-col items-center justify-center cursor-pointer bg-teal-50 hover:bg-teal-100"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" id="offerLetterInput" />
          <label htmlFor="offerLetterInput" className="cursor-pointer text-teal-600 font-semibold">
            {file ? file.name : 'Drag & drop or click to upload your offer letter'}
          </label>
        </div>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Moodle ID"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          value={moodleId}
          onChange={e => setMoodleId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company Name"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">Offer letter uploaded successfully!</div>}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Offer Letter'}
        </button>
      </form>
      {/* Show uploaded offer letter if exists */}
      {uploadedLetter && uploadedLetter.fileUrl && (
        <div className="mt-6 p-4 border rounded-lg bg-teal-50">
          <h3 className="text-lg font-semibold text-teal-700 mb-2">Your Uploaded Offer Letter:</h3>
          <a
            href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${uploadedLetter.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 underline"
          >
            View Offer Letter (PDF)
          </a>
          <div className="mt-2 text-sm text-gray-600">
            Company: {uploadedLetter.companyName}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferLetterPage;
