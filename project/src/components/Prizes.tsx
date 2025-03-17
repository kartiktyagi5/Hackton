import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Award, Gift, Star, Sparkles, Zap } from 'lucide-react';
import prize1 from '../assets/image.jpg';
import prize2 from '../assets/image2.jpg';
import prize3 from '../assets/image4.jpg';

gsap.registerPlugin(ScrollTrigger);

const prizes = [
  {
    position: 'First Place',
    icon: Trophy,
    secondaryIcon: Sparkles,
    prize: '$10,000',
    description: 'Cash prize plus exclusive mentorship opportunities and investor connections',
    gradient: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600',
    glow: 'shadow-[0_0_30px_rgba(250,204,21,0.5)]',
    textColor: 'text-yellow-500',
    accentColor: 'from-yellow-400 to-yellow-600',
    delay: 0,
    image: prize1, // Image for first place
  },
  {
    position: 'Second Place',
    icon: Award,
    secondaryIcon: Star,
    prize: '$5,000',
    description: 'Cash prize and fast-track interview with top tech companies',
    gradient: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500',
    glow: 'shadow-[0_0_25px_rgba(156,163,175,0.5)]',
    textColor: 'text-gray-500',
    accentColor: 'from-gray-400 to-gray-500',
    delay: 0.2,
    image: prize2, // Image for second place
  },
  {
    position: 'Third Place',
    icon: Gift,
    secondaryIcon: Zap,
    prize: '$2,500',
    description: 'Cash prize and premium tech stack subscriptions for one year',
    gradient: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800',
    glow: 'shadow-[0_0_25px_rgba(217,119,6,0.5)]',
    textColor: 'text-amber-600',
    accentColor: 'from-amber-500 to-amber-700',
    delay: 0.4,
    image: prize3, // Image for third place
  },
];

export default function Prizes() {
  const sectionRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prizesRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title with revealing effect
      const titleChars = document.querySelectorAll('.prize-title-char');
      gsap.from(titleChars, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        rotationX: 90,
        stagger: 0.03,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });

      // Create floating particles animation
      particlesRef.current.forEach((particleContainer) => {
        if (!particleContainer) return;

        const particles = particleContainer.querySelectorAll('.particle');

        particles.forEach((particle) => {
          gsap.to(particle, {
            x: 'random(-30, 30)',
            y: 'random(-30, 30)',
            opacity: 'random(0.3, 0.8)',
            scale: 'random(0.8, 1.2)',
            duration: 'random(2, 4)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      });

      // Animate each trophy card with 3D effect
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Initial animation to bring in the cards
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
          },
          y: 150,
          opacity: 0,
          rotationY: 45,
          rotationX: 15,
          transformPerspective: 1000,
          duration: 1,
          delay: prizes[index].delay,
          ease: 'power3.out',
        });

        // Create hover animation
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            rotationY: 15,
            rotationX: -10,
            scale: 1.08,
            duration: 0.4,
            ease: 'power2.out',
          });

          // Animate the badge
          const badge = card.querySelector('.badge');
          if (badge) {
            gsap.to(badge, {
              scale: 1.2,
              rotate: 10,
              duration: 0.4,
              ease: 'back.out',
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
          });

          // Reset the badge
          const badge = card.querySelector('.badge');
          if (badge) {
            gsap.to(badge, {
              scale: 1,
              rotate: 0,
              duration: 0.4,
              ease: 'back.out',
            });
          }
        });
      });

      // Animate the prize amounts
      prizesRef.current.forEach((prize, index) => {
        if (!prize) return;

        gsap.from(prize, {
          scrollTrigger: {
            trigger: prize,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
          textContent: '0',
          duration: 2.5,
          delay: prizes[index].delay + 0.6,
          snap: { textContent: 1 },
          ease: 'power2.out',
          onUpdate: function () {
            const rawValue = gsap.getProperty(prize, 'textContent') as string;
            const numericValue = parseFloat(rawValue.replace(/[$,]/g, ''));
            const prizeValue = prizes[index].prize;
            const targetValue = parseFloat(prizeValue.replace(/[$,]/g, ''));

            const percent = numericValue / targetValue;
            prize.textContent = '$' + Math.round(parseFloat(prizes[index].prize.replace(/[$,]/g, '')) * percent).toLocaleString();
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="prizes"
      className="py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #000000, #1a1a1a, #333333)',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMiAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
          <h2 className="inline-block text-4xl md:text-5xl font-extrabold text-white mb-4">
            {Array.from('Prizes & Rewards').map((char, i) => (
              <span key={i} className="prize-title-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Extraordinary innovation deserves extraordinary recognition. Discover what awaits our winners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {prizes.map((prize, index) => {
            const Icon = prize.icon;
            const SecondaryIcon = prize.secondaryIcon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="perspective-1000 relative cursor-pointer"
              >
                <div
                  className={`prize-card rounded-2xl overflow-hidden bg-white border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300`}
                >
                  {/* Background particle container */}
                  <div
                    ref={(el) => (particlesRef.current[index] = el)}
                    className="absolute inset-0 overflow-hidden opacity-40"
                  >
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`particle absolute rounded-full bg-gradient-to-r ${prize.accentColor} w-2 h-2 opacity-0`}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Position Badge */}
                  <div
                    className={`badge absolute -right-3 -top-3 z-10 w-16 h-16 rounded-full ${prize.gradient} flex items-center justify-center transition-transform duration-300 ${index === 0 ? prize.glow : 'shadow-lg'}`}
                  >
                    <div className="text-white font-bold">{index + 1}</div>
                  </div>

                  {/* Trophy/Position Banner */}
                  <div
                    className={`py-12 ${prize.gradient} relative`} // Increased padding to make the banner larger
                    style={{
                      backgroundImage: `url(${prize.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '250px', // Set a minimum height for the banner
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_50%_0%,white,transparent_60%)]"></div>
                    <div className="relative">
                      {/* Conditionally render the icon only if there is no image */}
                      {!prize.image && (
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                          <Icon className={`w-12 h-12 ${prize.textColor}`} />
                        </div>
                      )}
                      <div
                        className={`absolute -bottom-2 -right-2 w-10 h-10 ${prize.gradient} rounded-full flex items-center justify-center border-2 border-white ${index === 0 ? 'animate-pulse' : ''}`}
                      >
                        <SecondaryIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center mt-5 drop-shadow-md">
                      {prize.position}
                    </h3>
                  </div>

                  {/* Prize Content */}
                  <div className="p-8 text-center relative">
                    <div
                      ref={(el) => (prizesRef.current[index] = el)}
                      className={`text-5xl font-extrabold ${prize.textColor} mb-4`}
                    >
                      {prize.prize}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {prize.description}
                    </p>
                    <div
                      className={`mt-6 h-1 w-16 mx-auto rounded-full bg-gradient-to-r ${prize.accentColor}`}
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