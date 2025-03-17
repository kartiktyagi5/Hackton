import React from 'react';
import { Brain, Code2, Rocket, Smartphone, Globe, Shield } from 'lucide-react';

const tracks = [
  { icon: <Brain className="w-8 h-8" />, name: 'Artificial Intelligence', description: 'Build the next generation of AI-powered solutions' },
  { icon: <Code2 className="w-8 h-8" />, name: 'Web3 & Blockchain', description: 'Revolutionize the decentralized web' },
  { icon: <Rocket className="w-8 h-8" />, name: 'Sustainability', description: 'Tech solutions for a better planet' },
  { icon: <Smartphone className="w-8 h-8" />, name: 'Mobile Apps', description: 'Create innovative mobile experiences' },
  { icon: <Globe className="w-8 h-8" />, name: 'Open Source', description: 'Contribute to the global community' },
  { icon: <Shield className="w-8 h-8" />, name: 'Cybersecurity', description: 'Protect digital assets and privacy' }
];

export default function Tracks() {
  return (
    <section id="tracks" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-gradient">
            Hackathon Tracks
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-white border border-gray-100 
              hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-blue-600 mb-4">{track.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{track.name}</h3>
              <p className="text-gray-600">{track.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}