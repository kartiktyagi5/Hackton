import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Users, Network } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    title: 'Real-World Problems',
    description: 'Tackle industry challenges and make a real impact'
  },
  {
    icon: Users,
    title: 'Expert Mentorship',
    description: 'Learn from industry leaders and experienced professionals'
  },
  {
    icon: Network,
    title: 'Networking Opportunities',
    description: 'Connect with peers, mentors, and potential employers'
  }
];

export default function Features() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
            markers: false
          },
          y: 100,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out"
        });
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="feature" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
          Key Highlights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="feature-card group bg-white rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-100"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-all duration-300">
                  <Icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}