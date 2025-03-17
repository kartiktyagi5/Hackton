import React from 'react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-gradient">Register for CodeForChange</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Project Idea (Optional)</label>
            <textarea 
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              rows={4}
            />
          </div>
          <div className="flex space-x-4">
            <button 
              type="submit"
              className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white 
              font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Submit
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-semibold 
              transition-all duration-300 hover:bg-gray-50 hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}