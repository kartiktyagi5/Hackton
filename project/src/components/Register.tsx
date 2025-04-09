import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import team from '../assets/1.jpeg';

export default function Register() {
  return (
    <section 
      className="min-h-screen py-20 relative bg-gray-900 bg-fixed bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${team})`,
      }}
      id="register"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Registration Closed
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Thank you for your interest, but registration for this event has now closed.
            </p>
          </div>

          {/* Toggle Buttons - Disabled */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800 p-1 rounded-lg inline-flex opacity-50">
              <button
                disabled
                className="flex items-center px-6 py-3 rounded-md transition-all duration-300 text-gray-400 cursor-not-allowed"
              >
                <Users className="w-5 h-5 mr-2" />
                Create Team
              </button>
              <button
                disabled
                className="flex items-center px-6 py-3 rounded-md transition-all duration-300 text-gray-400 cursor-not-allowed"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Join Team
              </button>
            </div>
          </div>

          {/* Registration Closed Message */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Closed</h3>
              <p className="text-gray-600 mb-4">
                The registration period for this event has ended. No new teams can be created or joined at this time.
              </p>
              <p className="text-gray-500 text-sm">
                For any inquiries, please contact the event organizers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
