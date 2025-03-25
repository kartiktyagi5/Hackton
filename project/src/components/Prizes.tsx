import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Award, Gift, Star, Sparkles, Zap } from 'lucide-react';
import prize1 from '../assets/image.jpg';
import prize2 from '../assets/image2.jpg';
import prize3 from '../assets/image4.jpg';

gsap.registerPlugin(ScrollTrigger);

// Pre-define the number of particles
const PARTICLE_COUNT = 8;

const prizes = [
  {
    position: 'First Place',
    icon: Trophy,
    secondaryIcon: Sparkles,
    prize: '₹100,000',
    numericValue: 0,
    description: 'Cash prize plus exclusive mentorship opportunities and investor connections',
    gradient: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600',
    glow: 'shadow-[0_0_30px_rgba(250,204,21,0.5)]',
    textColor: 'text-yellow-500',
    accentColor: 'from-yellow-400 to-yellow-600',
    delay: 0,
    image: prize1,
  },
  {
    position: 'Second Place',
    icon: Award,
    secondaryIcon: Star,
    prize: '₹70,000',
    numericValue: 0,
    description: 'Cash prize and fast-track interview with top tech companies',
    gradient: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500',
    glow: 'shadow-[0_0_25px_rgba(156,163,175,0.5)]',
    textColor: 'text-gray-500',
    accentColor: 'from-gray-400 to-gray-500',
    delay: 0.1,
    image: prize2,
  },
  {
    position: 'Third Place',
    icon: Gift,
    secondaryIcon: Zap,
    prize: '₹50,000',
    numericValue: 0,
    description: 'Cash prize and premium tech stack subscriptions for one year',
    gradient: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800',
    glow: 'shadow-[0_0_25px_rgba(217,119,6,0.5)]',
    textColor: 'text-amber-600',
    accentColor: 'from-amber-500 to-amber-700',
    delay: 0.2,
    image: prize3,
  },
];

// Calculate particle positions once
const particlePositions = Array.from({ length: PARTICLE_COUNT }).map(() => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
}));

export default function Prizes() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const particlesRef = useRef([]);
  const [prizeValues, setPrizeValues] = useState(prizes.map(() => 0));
  const animationFrameId = useRef(null);
  const animationStartTimes = useRef(prizes.map(() => 0));
  const hasAnimated = useRef(prizes.map(() => false));

  useEffect(() => {
    // Create a GSAP context for cleaner organization and disposal
    const ctx = gsap.context(() => {
      // 1. Title animation
      const titleChars = document.querySelectorAll('.prize-title-char');
      gsap.from(titleChars, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        rotationX: 70,
        stagger: 0.02,
        duration: 0.4,
        ease: 'back.out(1.5)',
      });

      // 2. Cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // Create card entrance animation
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
            onEnter: () => {
              // Start the prize counter animation when card enters viewport
              startPrizeCounter(index);
            }
          },
          y: 100,
          opacity: 0,
          rotationY: 25,
          rotationX: 10,
          transformPerspective: 1000,
          duration: 0.8,
          delay: prizes[index].delay,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });
      
      // 3. Create particle animation
      particlesRef.current.forEach((particleContainer) => {
        if (!particleContainer) return;
        
        const particles = particleContainer.querySelectorAll('.particle');
        
        // Create a single timeline for all particles
        const particleTimeline = gsap.timeline();
        
        particles.forEach((particle, i) => {
          // Use simpler animations
          particleTimeline.to(particle, {
            x: gsap.utils.random(-20, 20),
            y: gsap.utils.random(-20, 20),
            opacity: gsap.utils.random(0.3, 0.7),
            duration: gsap.utils.random(1.5, 3),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.1,
          }, 0);
        });
      });
      
      // 5. Optimize hover effects
      const handleHover = (card, isEnter) => {
        if (!card) return;
        
        gsap.to(card, {
          rotationY: isEnter ? 8 : 0,
          rotationX: isEnter ? -5 : 0,
          scale: isEnter ? 1.05 : 1,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        
        const badge = card.querySelector('.badge');
        if (badge) {
          gsap.to(badge, {
            scale: isEnter ? 1.15 : 1,
            rotate: isEnter ? 5 : 0,
            duration: 0.3,
            ease: 'back.out',
            overwrite: 'auto',
          });
        }
      };
      
      // Set up event delegation for hover effects
      const container = document.querySelector('.prizes-container');
      if (container) {
        container.addEventListener('mouseenter', (e) => {
          const card = e.target.closest('.prize-card');
          if (card) handleHover(card, true);
        }, { passive: true });
        
        container.addEventListener('mouseleave', (e) => {
          const card = e.target.closest('.prize-card');
          if (card) handleHover(card, false);
        }, { passive: true });
      }
    }, sectionRef);

    // Cleanup all animations on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      ScrollTrigger.getAll().forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  // Use requestAnimationFrame for smooth prize counter animation
  const startPrizeCounter = (index) => {
    if (hasAnimated.current[index]) return;
    
    hasAnimated.current[index] = true;
    animationStartTimes.current[index] = Date.now();
    
    const targetValue = prizes[index].numericValue;
    const duration = 1200; // Animation duration in ms
    
    const updateCounter = () => {
      const now = Date.now();
      const elapsed = now - animationStartTimes.current[index];
      
      if (elapsed < duration) {
        // Easing function for smoother animation
        const progress = easeOutQuad(elapsed / duration);
        const newValue = Math.round(targetValue * progress);
        
        setPrizeValues(prev => {
          const newValues = [...prev];
          newValues[index] = newValue;
          return newValues;
        });
        
        animationFrameId.current = requestAnimationFrame(updateCounter);
      } else {
        // Ensure we reach the exact final value
        setPrizeValues(prev => {
          const newValues = [...prev];
          newValues[index] = targetValue;
          return newValues;
        });
      }
    };
    
    updateCounter();
  };
  
  // Easing function for smooth animation
  const easeOutQuad = (t) => t * (2 - t);

  return (
    <section
      ref={sectionRef}
      id="prizes"
      className="py-24 relative overflow-hidden will-change-transform"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f0f4ff)', // Subtle color fade at the bottom
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMiAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-15"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {Array.from('Prizes & Rewards').map((char, i) => (
              <span key={i} className="prize-title-char inline-block will-change-transform">{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Extraordinary innovation deserves extraordinary recognition. Discover what awaits our winners.
          </p>
        </div>

        <div className="prizes-container grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {prizes.map((prize, index) => {
            const Icon = prize.icon;
            const SecondaryIcon = prize.secondaryIcon;
            return (
              <div
                key={index}
                ref={el => (cardsRef.current[index] = el)}
                className="perspective-1000 relative will-change-transform"
              >
                <div
                  className={`prize-card rounded-2xl overflow-hidden bg-white border-2 border-gray-100 shadow-lg transition-all duration-300 will-change-transform`}
                >
                  {/* Background particle container */}
                  <div
                    ref={el => (particlesRef.current[index] = el)}
                    className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none"
                  >
                    {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                      <div
                        key={i}
                        className={`particle absolute rounded-full bg-gradient-to-r ₹{prize.accentColor} w-2 h-2 opacity-0 will-change-transform`}
                        style={{
                          left: particlePositions[i].left,
                          top: particlePositions[i].top,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Position Badge */}
                  <div
                    className={`badge absolute -right-3 -top-3 z-10 w-16 h-16 rounded-full ₹{prize.gradient} flex items-center justify-center transition-transform duration-300 will-change-transform ${index === 0 ? prize.glow : 'shadow-lg'}`}
                  >
                    <div className="text-white font-bold">{index + 1}</div>
                  </div>

                  {/* Trophy/Position Banner */}
                  <div
                    className={`py-12 ₹{prize.gradient} relative`}
                    style={{
                      backgroundImage: `url(${prize.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '220px',
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_50%_0%,white,transparent_60%)]"></div>
                    <div className="relative">
                      {/* Conditionally render the icon only if there is no image */}
                      {!prize.image && (
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                          <Icon className={`w-12 h-12 ₹{prize.textColor}`} />
                        </div>
                      )}
                      <div
                        className={`absolute -bottom-2 -right-2 w-10 h-10 ₹{prize.gradient} rounded-full flex items-center justify-center border-2 border-white ${index === 0 ? 'animate-pulse' : ''}`}
                      >
                        <SecondaryIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center mt-5 drop-shadow-md">
                      {prize.position}
                    </h3>
                  </div>

                  {/* Prize Content - Using React state instead of GSAP for the counter */}
                  <div className="p-8 text-center relative">
                    <div
                      className={`text-5xl font-extrabold ${prize.textColor} mb-4`}
                    >
                      ₹{prizeValues[index].toLocaleString()}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {prize.description}
                    </p>
                    <div
                      className={`mt-6 h-1 w-16 mx-auto rounded-full bg-gradient-to-r ₹{prize.accentColor}`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}