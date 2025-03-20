import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import image from '../assets/img2.png';

interface AuthProps {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up logic
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
        toast.success('Registration successful! Please check your email for confirmation.');
      } else {
        // Sign in logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Login successful!');
      }
      onSuccess(); // Call the onSuccess callback after successful login/signup
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error for incorrect login credentials
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Incorrect email or password. Please try again.');
        } else {
          toast.error(error.message); // Display other errors
        }
      } else {
        toast.error('An unexpected error occurred.'); // Fallback for unknown errors
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden relative h-[600px]">
        {/* Image Container */}
        <div
          className={`w-1/2 h-full bg-gray-900 flex items-center justify-center p-8 absolute top-0 transition-all duration-500 ease-in-out ${
            isSignUp ? 'left-1/2' : 'left-0'
          }`}
        >
          <img
            src={image}
            alt="Login Illustration"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Form Container */}
        <div
          className={`w-1/2 h-full p-10 transition-all duration-500 ease-in-out ${
            isSignUp ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isSignUp ? 'Create your account' : 'Welcome back!'}
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}