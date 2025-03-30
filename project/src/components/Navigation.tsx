import React, { useState, useEffect } from 'react';
import { Code2, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface NavigationProps {
  onRegisterClick: () => void;
}

export default function Navigation({ onRegisterClick }: NavigationProps) {
  const [session, setSession] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(!!session);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (sectionId: string) => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          <span className="text-lg sm:text-xl font-bold text-gradient">
            CodeForChange
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
          <a 
            href="#about" 
            onClick={(e) => { e.preventDefault(); handleNavLinkClick('about'); }}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            About
          </a>
         
          <a 
            href="#timeline" 
            onClick={(e) => { e.preventDefault(); handleNavLinkClick('timeline'); }}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Timeline
          </a>
          <a 
            href="#prizes" 
            onClick={(e) => { e.preventDefault(); handleNavLinkClick('prizes'); }}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Prizes
          </a>
          <a 
            href="#tracks" 
            onClick={(e) => { e.preventDefault(); handleNavLinkClick('tracks'); }}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Problem Statement
          </a>

          {!session ? (
            <button 
              onClick={() => navigate('/auth')}
              className="px-4 py-1.5 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
              transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              Register Now
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-1.5 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
              transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              Dashboard
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {!session ? (
            <button 
              onClick={() => navigate('/auth')}
              className="mr-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
              transition-all duration-300 hover:shadow-lg text-sm"
            >
              Register
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')}
              className="mr-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
              transition-all duration-300 hover:shadow-lg text-sm"
            >
              Dashboard
            </button>
          )}
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <a 
              href="#about" 
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('about'); }}
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
            >
              About
            </a>
            <a 
              href="#feature" 
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('feature'); }}
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
            >
              Features
            </a>
            <a 
              href="#timeline" 
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('timeline'); }}
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
            >
              Timeline
            </a>
            <a 
              href="#prizes" 
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('prizes'); }}
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
            >
              Prizes
            </a>
            <a 
              href="#tracks" 
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('tracks'); }}
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
            >
              Problem Statement
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}