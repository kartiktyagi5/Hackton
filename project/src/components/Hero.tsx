import React from 'react';
import img1 from '../assets/main.webp';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router

interface HeroProps {
  onRegisterClick: () => void;
}

export default function Hero({ onRegisterClick }: HeroProps) {
  const navigate = useNavigate();

  // Function to handle the ripple effect
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
      className="h-screen w-full relative bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${img1})` }}
    >
      {/* Overlay to make text more readable */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="container mx-auto px-6 h-full flex items-center relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left ">
            <h1 
              className="text-4xl sm:text-6xl md:text-6xl font-bold mb-6 leading-tight text-white "
              style={{ animation: 'fadeInUp 1s ease-out ', width: '120%'}}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 ">
              Revolutionize with Code,
              </span>
              <br />
              <span style={{ animation: 'fadeInUp 1s ease-out 0.1s' }}> Sustain with Innovation</span>
            </h1>
            <p 
              className="text-xl text-gray-200 mb-8"
              style={{ animation: 'fadeInUp 1s ease-out 0.2s' }}
            >
              Join <span className="font-semibold text-blue-400">1200+ brilliant minds</span> for an action-packed 24-hour hackathon  turn bold ideas into reality tackle real-world challenges, and get mentorship from top industry experts, and compete for exciting prizes.
            </p>
            <div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start"
              style={{ animation: 'fadeInUp 1s ease-out 0.3s' }}
            >
              <button 
                onClick={(e) => {
                  createRipple(e);
                  navigate('/auth');
                }}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold 
                transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
              >
                Register Now
                <style>
                  {`
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
                  `}
                </style>
              </button>
              <a 
                href="#about"
                onClick={(e) => {
                  createRipple(e);
                }}
                className="px-8 py-3 border border-blue-600 rounded-full text-blue-600 font-semibold 
                transition-all duration-300 hover:bg-blue-50 hover:shadow-lg hover:scale-105 relative overflow-hidden"
              >
                Learn More
                <style>
                  {`
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
                  `}
                </style>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Animated floating elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>
      <div 
        className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500 rounded-full opacity-20"
        style={{ animation: 'float 4s ease-in-out infinite' }}
      ></div>
      <div 
        className="absolute top-1/3 right-1/4 w-12 h-12 bg-purple-500 rounded-full opacity-20"
        style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}
      ></div>

      {/* Inline styles for animations */}
      <style>
        {`
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
        `}
      </style>
    </section>
  );
}