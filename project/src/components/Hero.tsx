import React from 'react';
import img1 from '../assets/main.webp';

interface HeroProps {
  onRegisterClick: () => void;
}

export default function Hero({ onRegisterClick }: HeroProps) {
  return (
    <section 
      className="h-screen w-full relative bg-cover bg-center"
      style={{ backgroundImage: `url(${img1})` }}
    >
      {/* Overlay to make text more readable */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="container mx-auto px-6 h-full flex items-center relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-white">
              <span className="text-gradient">
                Code the Future,
              </span>
              <br />
              Hack the Impossible
            </h1>
            <p className="text-xl text-gray-200 mb-8">
            Join 1200+ brilliant minds for an action-packed 24-hour hackathon where you’ll 
            turn bold ideas into reality! Work on real-world challenges, collaborate with top
             mentors and compete for exciting prizes. Gain hands-on experience, build a standout portfolio,
              and unlock career-changing opportunities with industry leaders.

            </p>
            <div className="flex space-x-4">
              <button 
                onClick={()=> navigate('/auth')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
                transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Register Now
              </button>
              <a 
                href="#about"
                className="px-8 py-3 border border-blue-600 rounded-full text-blue-600 font-semibold 
                transition-all duration-300 hover:bg-blue-50 hover:shadow-lg hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
