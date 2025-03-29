import React from 'react';
import { Sparkles, Globe2, Target, Recycle, Shield } from 'lucide-react';

interface ChallengeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
}

function ChallengeCard({ icon, title, description, impact }: ChallengeCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 w-full h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-black">{icon}</span>
        <h2 className="text-xl font-semibold text-black">{title}</h2>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <div className="flex items-center gap-2 mb-4">
        <Globe2 size={18} className="text-gray-500" />
        <p className="text-gray-500 text-sm">{impact}</p>
      </div>
      <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2">
        <Target size={18} />
        Choose Challenge
      </button>
    </div>
  );
}

function Tracks() {
  const challenges = [
    {
      icon: <Sparkles size={24} />,
      title: "Decentralized Identity Management",
      description: "Create a secure, self-sovereign identity system for digital identity verification.",
      impact: "Empower users with control over their digital identity"
    },
    {
      icon: <Shield size={24} />,
      title: "IoT Device Security",
      description: "Develop a solution to protect IoT devices from cyber attacks and unauthorized access.",
      impact: "Secure the growing network of connected devices"
    },
    {
      icon: <Globe2 size={24} />,
      title: "Smart Energy Grid",
      description: "Build a platform to optimize renewable energy distribution and consumption in urban areas.",
      impact: "Reduce carbon footprint and improve energy efficiency"
    },
    {
      icon: <Recycle size={24} />,
      title: "Waste Management Tracker",
      description: "Develop a system to track and optimize waste collection and recycling processes.",
      impact: "Minimize environmental impact through better waste management"
    },
    {
      icon: <Shield size={24} />,
      title: "Phishing Detection System",
      description: "Create a system to detect and prevent sophisticated phishing attacks.",
      impact: "Protect users from evolving cyber threats"
    },
    {
      icon: <Shield size={24} />,
      title: "Phishing Detection System",
      description: "Create a system to detect and prevent sophisticated phishing attacks.",
      impact: "Protect users from evolving cyber threats"
    }
  ];

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f0f4ff)', // Subtle color fade at the bottom
      }}
      id='tracks'
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">Hackathon Problem Statements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((challenge, index) => (
            <ChallengeCard key={index} {...challenge} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tracks;