import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Users, Mail, Eye, EyeOff } from 'lucide-react';

const AdminCredentialsInfo = () => {
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminCredentials();
  }, []);

  const fetchAdminCredentials = async () => {
    try {
      const response = await axios.get('/api/admin/credentials');
      setAdminAccounts(response.data.admins);
    } catch (error) {
      console.error('Error fetching admin credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (email) => {
    setShowPasswords(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  };

  // Predefined passwords for display (in real app, these would be securely managed)
  const getPassword = (email) => {
    const passwords = {
      'admin@apsit.edu.in': 'admin123',
      'placement.admin@apsit.edu.in': 'placement2024',
      'hod.computer@apsit.edu.in': 'hod2024'
    };
    return passwords[email] || '••••••••';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-red-600 mr-3" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Account Information</h2>
          <p className="text-gray-600">Authorized admin accounts for E-Placement Hub</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="font-semibold text-red-800">Important Security Notice</h3>
        </div>
        <p className="text-red-700 text-sm mt-2">
          These are the only authorized admin accounts. Admin accounts cannot be created through self-registration.
          Contact the system administrator to modify admin access.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {adminAccounts.map((admin, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{admin.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{admin.department}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 mr-2 text-xs">Password:</div>
                    <div className="flex items-center">
                      <span className={`font-mono text-sm ${showPasswords[admin.email] ? 'text-gray-900' : 'text-gray-400'}`}>
                        {showPasswords[admin.email] ? getPassword(admin.email) : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(admin.email)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords[admin.email] ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Admin Login Instructions</h3>
        <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
          <li>Use any of the authorized admin email addresses above</li>
          <li>Enter the corresponding password</li>
          <li>You will be automatically redirected to the admin dashboard</li>
          <li>Admin sessions are valid for 8 hours</li>
        </ol>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Security Recommendations</h3>
        <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
          <li>Change default passwords immediately after first login</li>
          <li>Use strong, unique passwords for each admin account</li>
          <li>Enable two-factor authentication when available</li>
          <li>Regularly review and audit admin access</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminCredentialsInfo;