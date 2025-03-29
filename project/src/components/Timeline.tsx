import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, MessageCircle, Code2, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    icon: Users,
    title: 'Registration Opens',
    date: 'March 29',
    description: 'Start your journey by registering your team and project idea',
  },
  {
    icon: MessageCircle,
    title: 'Registration Close',
    date: 'April 7',
    description: 'Find your perfect teammates and brainstorm innovative solutions',
  },
  {
    icon: Code2,
    title: 'Hackathon Date',
    date: 'April 11-12',
    description: '28 hours of coding, creativity, collaboration, and Mentoring-session ',
  },
  {
    icon: Trophy,
    title: 'Evaluation & Prizes',
    date: 'April 12',
    description: 'Present your project and celebrate achievements',
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the timeline line
      gsap.from('.timeline-line-progress', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
        scaleY: 0,
        transformOrigin: 'top',
      });

      // Animate timeline items
      timelineItemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top bottom-=100',
            end: 'center center',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Animate the dot
        gsap.from(item.querySelector('.timeline-dot'), {
          scrollTrigger: {
            trigger: item,
            start: 'top bottom-=100',
            end: 'center center',
            toggleActions: 'play none none reverse',
          },
          scale: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 relative"
      id="timeline"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f0f4ff)', // Subtle color fade at the bottom
      }}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Event Timeline
        </h2>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line with animation */}
          <div className="absolute left-[20px] md:left-1/2 w-[2px] h-full -translate-x-1/2 bg-gray-700">
            <div
              className="timeline-line-progress absolute top-0 left-0 w-full h-full"
              style={{
                background: 'linear-gradient(to bottom, #4f46e5, #9333ea, #ec4899)',
              }}
            />
          </div>

          <div className="space-y-24">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  ref={(el) => (timelineItemsRef.current[index] = el)}
                  className={`timeline-card relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div
                    className="timeline-dot absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 shadow-lg"
                    style={{
                      background: 'linear-gradient(to bottom, #4f46e5, #9333ea)',
                    }}
                  />

                  {/* Content card */}
                  <div
                    className={`ml-12 md:ml-0 bg-white p-6 rounded-xl shadow-lg w-full md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                    } transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  >
                    <div className="flex items-center mb-4">
                      <div
                        className="p-2 rounded-lg mr-4"
                        style={{
                          background: 'linear-gradient(to bottom, #4f46e5, #9333ea)',
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}