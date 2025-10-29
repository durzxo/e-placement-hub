import React, { useState } from 'react';
import axios from 'axios';

const EmailTestComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testEmailSystem = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/notices/test-email');
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestNotice = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const testNotice = {
        title: 'Test Notice - Email Notification Demo',
        content: 'This is a demonstration of the automated email notification system. When admins create notices, all students receive email notifications automatically.',
        priority: 'high',
        category: 'general',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        author: 'Admin Demo'
      };

      const response = await axios.post('http://localhost:5000/api/notices', testNotice);
      setResult({
        message: 'Notice created successfully! Email notifications sent to all students.',
        notice: response.data
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📧 Email Notification System Test</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Email Configuration Status</h3>
          <p className="text-sm text-blue-600">
            The system is configured to send email notifications when:
          </p>
          <ul className="text-sm text-blue-600 mt-2 ml-4 list-disc">
            <li>Admin creates a new notice</li>
            <li>All students receive automatic email notifications</li>
            <li>Emails include rich HTML formatting with notice details</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={testEmailSystem}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Testing...' : '🧪 Test Email System'}
          </button>

          <button
            onClick={createTestNotice}
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : '📝 Create Test Notice'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-red-600 font-semibold">❌ Error:</span>
              <span className="text-red-700 ml-2">{error}</span>
            </div>
            {error.includes('Email configuration missing') && (
              <div className="mt-3 text-sm text-red-600">
                <p><strong>To fix this:</strong></p>
                <ol className="list-decimal ml-4 mt-1">
                  <li>Set up Gmail App Password (see EMAIL_SETUP.md)</li>
                  <li>Update .env file with EMAIL_USER and EMAIL_PASS</li>
                  <li>Restart the backend server</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-green-600 font-semibold">✅ Success:</span>
              <span className="text-green-700 ml-2">{result.message}</span>
            </div>
            
            {result.emailConfig && (
              <div className="text-sm text-green-600 mt-2">
                <p><strong>Email Configuration:</strong></p>
                <p>• User: {result.emailConfig.user}</p>
                <p>• Configured: {result.emailConfig.configured ? 'Yes' : 'No'}</p>
              </div>
            )}

            {result.notice && (
              <div className="text-sm text-green-600 mt-2">
                <p><strong>Notice Created:</strong> {result.notice.title}</p>
                <p><strong>Priority:</strong> {result.notice.priority}</p>
                <p><strong>Category:</strong> {result.notice.category}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">📋 How to Set Up Email Notifications</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>1. Gmail Setup:</strong></p>
            <ul className="ml-4 list-disc">
              <li>Enable 2-Factor Authentication on your Google account</li>
              <li>Generate an App Password for "Mail"</li>
              <li>Use the 16-character app password (not your regular Gmail password)</li>
            </ul>
            
            <p><strong>2. Environment Configuration:</strong></p>
            <ul className="ml-4 list-disc">
              <li>Edit <code>backend/.env</code> file</li>
              <li>Set <code>EMAIL_USER=your-gmail@gmail.com</code></li>
              <li>Set <code>EMAIL_PASS=your-app-password</code></li>
            </ul>

            <p><strong>3. Test:</strong></p>
            <ul className="ml-4 list-disc">
              <li>Restart the backend server</li>
              <li>Use the test buttons above</li>
              <li>Check student email addresses for notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTestComponent;