import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbulb, CheckCircle, Target, Code } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const criteria = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Uniqueness and creativity of the solution',
    weight: '30%'
  },
  {
    icon: CheckCircle,
    title: 'Feasibility',
    description: 'Practical implementation and scalability',
    weight: '25%'
  },
  {
    icon: Target,
    title: 'Impact',
    description: 'Potential to solve real-world problems',
    weight: '25%'
  },
  {
    icon: Code,
    title: 'Technical Implementation',
    description: 'Code quality and technical complexity',
    weight: '20%'
  }
];

export default function Judging() {
  const sectionRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.section-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
      });

      // Animate cards with stagger
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            end: 'top center',
            toggleActions: 'play none none reverse',
          },
          y: 100,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.2,
          ease: 'power3.out',
        });

        // Animate weight numbers
        gsap.from(card.querySelector('.weight-number'), {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
          textContent: 0,
          duration: 1.5,
          snap: { textContent: 1 },
          stagger: 0.2,
          ease: 'power2.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="judging" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
          Judging Criteria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {criteria.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="criteria-card group bg-white rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-100"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100">
                  <Icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="weight-number text-2xl font-bold text-blue-600">
                  {item.weight}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}