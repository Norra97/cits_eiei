import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ForgotPasswordSent() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.maskedEmail || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <p>
          {email
            ? <>Email has been sent to <span className="font-bold">{email}</span> successfully.<br /></>
            : null}
          Please check your email for the reset password link.<br />
          If you cannot find it, please check your junk or spam mail.
        </p>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/login')}
        >
          Return to sign-in
        </button>
      </div>
    </div>
  );
} 