import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle email submission logic here
    console.log('Email submitted:', email);
    setStep('otp');
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      // Handle OTP verification logic here
      console.log('OTP submitted:', otpString);
      setStep('success');
    } else {
      alert('Please enter all 6 digits');
    }
  };

  const resendOtp = () => {
    // Handle resend OTP logic here
    console.log('Resending OTP to:', email);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <div className="flex items-center">
              <GraduationCap className="h-12 w-12 text-teal-600" />
              <div className="ml-3 text-center">
                <h1 className="text-2xl font-bold text-gray-900">APSIT PLACEMENT</h1>
                <p className="text-sm text-gray-600">Computer Department</p>
              </div>
            </div>
          </Link>
          
          {step === 'email' && (
            <>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                Forgot your password?
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </>
          )}
          
          {step === 'otp' && (
            <>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                Enter OTP
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We've sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
              </p>
            </>
          )}
          
          {step === 'success' && (
            <>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                OTP Verified!
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Your OTP has been verified successfully. You can now reset your password.
              </p>
            </>
          )}
        </div>
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-200">
          {step === 'email' && (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Send OTP
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                  Enter 6-digit OTP
                </label>
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`otp-${index - 1}`);
                          if (prevInput) prevInput.focus();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="font-medium text-teal-600 hover:text-teal-500"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Verify OTP
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-gray-600">
                Your identity has been verified. You can now proceed to reset your password.
              </p>
              <button
                onClick={() => {
                  // Redirect to reset password page or handle password reset
                  console.log('Proceeding to password reset');
                }}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Reset Password
              </button>
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          {step === 'otp' && (
            <button
              onClick={() => setStep('email')}
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Change email address
            </button>
          )}
          <Link to="/login" className="block text-sm text-gray-600 hover:text-gray-900">
            Remember your password? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
