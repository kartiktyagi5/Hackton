import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Users, Network, Target, Lightbulb, Handshake, Volume2, VolumeX } from 'lucide-react';
import video from "../assets/intro1.mp4";
import klLogo from "../assets/kl.png";
import startupLogo from "../assets/startup.png";
import innovienceLogo from "../assets/innovience1.png";
import alkov from "../assets/alcov.png";
gsap.registerPlugin(ScrollTrigger);

function AboutPage() {
  const sectionRefs = useRef([]);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-white text-gray-900 relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#4166d5]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-[#4166d5]/5 rounded-full blur-3xl animate-float-delay"></div>
      </div>

      
      <section className="relative pt-16 pb-12 px-6 max-w-6xl mx-auto text-center" id="about">
        <div className="flex flex-wrap justify-center items-center gap-14 mb-40 pt-12">
          <img 
            src={klLogo} 
            alt="KL University Logo" 
            className="h-28 md:h-36 object-contain" 
          />
          <div className="flex flex-col md:flex-row gap-14 items-center">
            <img 
              src={startupLogo} 
              alt="Startup Society Logo" 
              className="h-28 md:h-36 object-contain"  
            />
            <img 
              src={innovienceLogo} 
              alt="Innovience Logo" 
              className="h-28 md:h-36 object-contain" 
            />
            <img 
              src={alkov} 
              alt="alkov Logo" 
              className="h-28 md:h-36 object-contain" 
            />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#4166d5] mb-4 mt-16">
          About Code4Change
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Empowering students to solve real-world challenges through innovation and collaboration
        </p>
      </section>

      <div className="relative z-30 bg-white">

        <section 
          ref={el => sectionRefs.current[0] = el}
          className="pb-16 px-6 max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#4166d5] mb-6">
                <span className="border-b-4 border-[#4166d5] pb-2">Our Mission</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Code4Change is a national-level hackathon open to all college students, organized by Startup Society & Innovience in collaboration with industry and NGO partners. We bridge technology and real-world impact through hands-on problem solving.
              </p>
              <div className="bg-[#4166d5]/10 p-6 rounded-xl border-l-4 border-[#4166d5]">
                <h3 className="font-semibold text-[#4166d5] mb-3 flex items-center">
                  <Lightbulb className="mr-2" /> Purpose & Vision
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-[#4166d5] mr-2">•</span>
                    <span>Foster innovation through real-world problem-solving</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#4166d5] mr-2">•</span>
                    <span>Engage students with NGO and industry challenges</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 rounded-xl overflow-hidden aspect-square shadow-lg relative">
              <video 
                ref={videoRef}
                autoPlay 
                muted={isMuted}
                loop 
                className="w-full h-full object-cover"
                src={video}
              />
              <button 
                onClick={toggleMute}
                className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </section>

        {/* Why Real-World Problems */}
        <section 
          ref={el => sectionRefs.current[1] = el}
          className="py-16 bg-gray-50"
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#4166d5] mb-12 text-center">
              <span className="relative inline-block pb-2">
                Why Real-World Problems?
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#4166d5]"></span>
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="w-14 h-14 bg-[#4166d5]/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="text-[#4166d5]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Hands-on Exposure</h3>
                <p className="text-gray-600">Direct industry experience with actual organizational challenges</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="w-14 h-14 bg-[#4166d5]/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="text-[#4166d5]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real Constraints</h3>
                <p className="text-gray-600">Understanding actual business needs and operational limitations</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="w-14 h-14 bg-[#4166d5]/10 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="text-[#4166d5]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tangible Impact</h3>
                <p className="text-gray-600">Creating solutions that can be deployed to make real difference</p>
              </div>
            </div>
          </div>
        </section>

        {/* Objectives */}
        <section 
          ref={el => sectionRefs.current[2] = el}
          className="py-16 relative"
        >
          <div className="absolute inset-0 bg-[#4166d5]/5 -skew-y-3 origin-top-left"></div>
          <div className="max-w-5xl mx-auto px-6 relative">
            <h2 className="text-3xl font-bold text-[#4166d5] mb-8">
              Our Objectives
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  number: "1",
                  title: "Encourage Problem-Solving & Entrepreneurship",
                  description: "Inspire innovation, foster an entrepreneurial mindset, and provide a pitching platform."
                },
                {
                  number: "2",
                  title: "Expose Students to Real-World Challenges",
                  description: "Solve actual NGO & industry problems with real-world impact."
                },
                {
                  number: "3",
                  title: "Promote Interdisciplinary Collaboration",
                  description: "Blend tech, business & design for holistic solutions."
                },
                {
                  number: "4",
                  title: "Provide Hands-on Learning & Networking",
                  description: "Get mentorship, industry connections & post-hackathon opportunities."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#4166d5]/50 transition-all group hover:shadow-sm"
                >
                  <div className="flex items-start">
                    <span className="text-2xl font-bold text-[#4166d5] mr-4 group-hover:scale-110 transition-transform">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizers & Partners with Color Fade */}
        <section 
          ref={el => sectionRefs.current[3] = el}
          className="py-16 relative"
          style={{
            background: 'linear-gradient(to bottom, #ffffff, #f0f4ff)'
          }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#4166d5] mb-8">
              <span className="border-b-2 border-[#4166d5] pb-2">Organizers & Partners</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
                <div className="w-12 h-12 bg-[#4166d5]/10 rounded-full flex items-center justify-center mb-4">
                  <Handshake className="text-[#4166d5]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Startup Society</h3>
                <p className="text-gray-600">Primary organizer driving the hackathon initiative</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
                <div className="w-12 h-12 bg-[#4166d5]/10 rounded-full flex items-center justify-center mb-4">
                  <Network className="text-[#4166d5]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Innovience</h3>
                <p className="text-gray-600">Tech Partner providing mentorship and resources</p>
                <a 
                  href="https://www.innovience.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4166d5] hover:underline mt-2 inline-block"
                >
                  Visit Website
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
                <div className="w-12 h-12 bg-[#4166d5]/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-[#4166d5]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Advitiyah</h3>
                <p className="text-gray-600">Media Partner handling promotion and coverage</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
