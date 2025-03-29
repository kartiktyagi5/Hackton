import React,{useState,useEffect} from 'react';
import { Code2 } from 'lucide-react';
import {useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
interface NavigationProps {
  onRegisterClick: () => void;
}

export default function Navigation({ onRegisterClick }: NavigationProps) {
  const [session, setSession] = useState<boolean>(false);
  const navigate= useNavigate();
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
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gradient">
            CodeForChange
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
          <a href="#feature" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
          <a href="#timeline" className="text-gray-600 hover:text-blue-600 transition-colors">Timeline</a>
          <a href="#prizes" className="text-gray-600 hover:text-blue-600 transition-colors">Prizes</a>
          <a href="#tracks" className="text-gray-600 hover:text-blue-600 transition-colors">Problem Statement</a>
        </div>
        {!session?
        <button 
          onClick={()=>navigate('/auth')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
          transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Register Now
        </button>
          :
          <button 
          onClick={()=> navigate('/dashboard')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
          transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Dashboard
        </button>
        }
      </div>
    </nav>
  );
}