import React from 'react';
import { Youtube, Linkedin, Instagram } from 'lucide-react';

// Custom Unstop SVG Icon
const UnstopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    {/* Placeholder SVG path for Unstop logo */}
    <path d="M12 2L2 22h20L12 2zM12 6l7 14H5l7-14z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-xl mb-4">Code4Change</h3>
            <p className="text-gray-400 mb-4">
              Join us in solving real-world challenges through innovation and technology.
              <br/>Collaborate with NGOs and industry experts to create impact-driven solutions.
            </p>
            <div className="flex space-x-4">
              <a href="https://unstop.com/hackathons/code4change-kl-university-vijayawada-1436743" className="text-gray-400 hover:text-white transition-colors">
                <UnstopIcon />
              </a>
              <a href="https://www.youtube.com/@Innovience" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/company/innovience-intelligence/?viewAsMember=true" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/innovience_interns?igsh=MWFkM3FsYzQ5MXo5ZQ==" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#feature" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#timeline" className="text-gray-400 hover:text-white transition-colors">
                  Timeline
                </a>
              </li>
              <li>
                <a href="#judging" className="text-gray-400 hover:text-white transition-colors">
                  Judging Criteria
                </a>
              </li>
              <li>
                <a href="#register" className="text-gray-400 hover:text-white transition-colors">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contact@innovience.in</li>
              <li>Phone: 8744915108 , 8252570419</li>
              <li>Location: kl university , Guntur</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-gray-400">
          <p>© Code4Change. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}