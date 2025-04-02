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
        localStorage.setItem('user', email);
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

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
      {/* Card container - maintain original height */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden relative h-auto md:h-[600px]">
        {/* For mobile: Stack vertically, For desktop: Side by side */}
        
        {/* Mobile view: Top section (visible on mobile only) */}
        <div className="md:hidden w-full h-64 bg-gray-900 relative">
          <img
            src={image}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
          </div>
        </div>

        {/* Desktop view: Image container with animation */}
        <div
          className={`hidden md:block w-1/2 h-full bg-gray-900 absolute top-0 transition-all duration-500 ease-in-out ${
            isSignUp ? 'left-1/2' : 'left-0'
          }`}
        >
          <img
            src={image}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Container - adaptable for both mobile and desktop */}
        <div 
          className={`w-full md:w-1/2 p-6 sm:p-8 md:p-10 md:h-full md:transition-all md:duration-500 md:ease-in-out ${
            isSignUp ? 'md:translate-x-0' : 'md:translate-x-full'
          }`}
        >
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              {isSignUp ? 'Create your account' : 'Welcome back!'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-8">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-3 mt-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
