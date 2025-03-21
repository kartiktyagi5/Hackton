import React, { useState } from 'react';
import { Brain, Database, Shield, Leaf, Sparkles } from 'lucide-react';

function Tracks() {
  const [selectedDomain, setSelectedDomain] = useState('Artificial Intelligence');

  const domains = [
    { name: 'Artificial Intelligence', icon: Brain },
    { name: 'Blockchain', icon: Database },
    { name: 'Cybersecurity', icon: Shield },
    { name: 'Sustainability', icon: Leaf },
  ];

  const challenges = {
    'Artificial Intelligence': [
      {
        title: 'Healthcare Diagnosis Assistant',
        description: 'Develop an AI system that helps medical professionals identify rare diseases from patient symptoms and medical history.',
        benefit: 'Improve early disease detection and save lives through accurate diagnosis',
      },
      {
        title: 'AI-Powered Educational Tools',
        description: 'Create AI-driven tools to enhance learning experiences for students and educators.',
        benefit: 'Revolutionize education with personalized and adaptive learning',
      },
    ],
    'Blockchain': [
      {
        title: 'Blockchain-based Voting System',
        description: 'Create a secure and transparent voting system using blockchain technology.',
        benefit: 'Ensure fair and tamper-proof elections',
      },
      {
        title: 'Decentralized Finance (DeFi) Platform',
        description: 'Build a decentralized financial platform to enable peer-to-peer lending and borrowing.',
        benefit: 'Empower users with financial freedom and transparency',
      },
    ],
    'Cybersecurity': [
      {
        title: 'Advanced Threat Detection',
        description: 'Develop a system that can detect and neutralize advanced cyber threats in real-time.',
        benefit: 'Protect sensitive data and infrastructure from cyber attacks',
      },
      {
        title: 'Zero Trust Security Framework',
        description: 'Implement a zero-trust security model to enhance organizational cybersecurity.',
        benefit: 'Minimize risks and prevent unauthorized access',
      },
    ],
    'Sustainability': [
      {
        title: 'Sustainable Energy Management',
        description: 'Design a platform that optimizes energy consumption and promotes the use of renewable energy sources.',
        benefit: 'Reduce carbon footprint and promote sustainable living',
      },
      {
        title: 'Waste Reduction Solutions',
        description: 'Develop innovative solutions to reduce waste and promote recycling.',
        benefit: 'Contribute to a cleaner and greener planet',
      },
    ],
  };

  const handleDomainClick = (domain) => {
    setSelectedDomain(domain);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      {/* Problem Statement Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-black">
          Hackathon Problem Statement
        </h1>
        <p className="text-xl text-gray-600">Choose a domain and explore the challenges</p>
      </div>

      {/* Top Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {domains.map((domain, index) => (
          <div
            key={index}
            className={`${
              selectedDomain === domain.name 
                ? 'bg-gradient-to-br from-black to-gray-800 text-white shadow-lg' 
                : 'bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 shadow-md'
            } p-8 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 hover:shadow-xl`}
            onClick={() => handleDomainClick(domain.name)}
          >
            <domain.icon className="w-12 h-12 mb-4" />
            <span className="text-xl font-semibold text-center">{domain.name}</span>
          </div>
        ))}
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {challenges[selectedDomain].map((challenge, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-black to-gray-800 text-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h2 className="text-2xl font-semibold">{challenge.title}</h2>
            </div>
            <p className="text-gray-200 mb-6">{challenge.description}</p>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded-full border-2 border-yellow-300" />
              <p className="text-gray-200">{challenge.benefit}</p>
            </div>
            <button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Choose Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tracks;