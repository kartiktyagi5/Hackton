import React from 'react';
import img1 from '../assets/main.webp';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onRegisterClick: () => void;
}

export default function Hero({ onRegisterClick }: HeroProps) {
  const navigate = useNavigate();

  const createRipple = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  return (
    <section 
      className="min-h-screen w-full relative bg-cover bg-center overflow-hidden flex items-center"
      style={{ backgroundImage: `url(${img1})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="container mx-auto px-4 sm:px-6 h-full flex items-center relative z-10 py-20">
        <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-white"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 block animate-fadeInUp">
              Revolutionize with Code,
            </span>
            <span className="block animate-fadeInUp delay-100">Sustain with Innovation</span>
          </h1>
          
          <p 
            className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl animate-fadeInUp delay-200"
          >
            Join <span className="font-semibold text-blue-400">1200+ brilliant minds</span> for an action-packed 24-hour hackathon to turn bold ideas into reality, tackle real-world challenges, and get mentorship from top industry experts.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-300"
          >
            <button 
              onClick={(e) => {
                createRipple(e);
                navigate('/#register');
              }}
              className="px-6 py-3 sm:px-8 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
              transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden
              text-sm sm:text-base"
            >
              Register Now
            </button>
            
            <a 
              href="#about"
              onClick={createRipple}
              className="px-6 py-3 sm:px-8 sm:py-3 border border-blue-600 rounded-full text-blue-600 font-semibold 
              transition-all duration-300 hover:bg-blue-50 hover:shadow-lg hover:scale-105 relative overflow-hidden
              text-sm sm:text-base"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Animated floating elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>
      <div 
        className="absolute top-1/4 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full opacity-20 animate-float"
      ></div>
      <div 
        className="absolute top-1/3 right-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full opacity-20 animate-float delay-500"
      ></div>

      {/* Ripple effect styles */}
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>

      {/* Animation styles - can also be moved to your global CSS */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}
