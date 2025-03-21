import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Brain, Users, Network } from 'lucide-react';
import video from "../assets/Untitled design.mp4"; // Import the video file

gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <div className="bg-white text-gray-900 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#4166d5]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-[#4166d5]/10 rounded-full blur-xl"></div>
        <div className="absolute top-60 right-40 w-24 h-24 bg-[#4166d5]/10 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold mb-8 text-[#4166d5]">
              Code4Change
            </h1>
            <div className="w-20 h-1 bg-[#4166d5] mb-8"></div>
            <p className="text-lg leading-relaxed text-gray-700">
              CODE4CHANGE is a national-level hackathon by Innovience, in collaboration with Startup Society, NGOs,
              industry partners, and Adwitiyah (Media Partner). We aim to bridge technology and real-world impact,
              empowering students to solve pressing societal and industry challenges. With hands-on learning, mentorship,
              and networking, participants develop innovative, deployable solutions while gaining industry exposure.
              Join us to innovate, solve, and create impact!
            </p>
          </div>

          {/* Right column - Video card */}
          <div className="relative group w-full lg:w-3/4 mx-auto"> {/* Reduced width */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-[#4166d5]/20">
              <div className="relative h-96 rounded-lg overflow-hidden"> {/* Increased height */}
                <video
                  src={video}
                  className="w-full h-full object-cover" // Use object-cover to fill the container
                  controls // Add video controls
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-[#4166d5]">Watch the Code4Change Story</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function Features() {
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
    <section ref={sectionRef} id="feature" className="pt-12 pb-20 bg-white">
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
                <div className="w-16 h-16 mx-auto mb-6 bg-[#4166d5]/10 rounded-full flex items-center justify-center group-hover:bg-[#4166d5]/20 transition-all duration-300">
                  <Icon className="w-8 h-8 text-[#4166d5] group-hover:text-[#4166d5]/90" />
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

export default function CombinedSections() {
  return (
    <>
      <App />
      <Features />
    </>
  );
}