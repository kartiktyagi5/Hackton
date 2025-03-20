import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-xl mb-4">Code4Change</h3>
            <p className="text-gray-400 mb-4">
              Join us in transforming modern industries through innovation and technology.<br/>
              Connect with industry leaders and showcase your skills.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
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
              <li>Phone: 8744915108,8252570419</li>
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