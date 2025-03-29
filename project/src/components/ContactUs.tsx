import React from 'react';
import { Mail, Phone, MapPin, Youtube, Linkedin, Instagram } from 'lucide-react';

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
    <path d="M12 2L2 22h20L12 2zM12 6l7 14H5l7-14z" />
  </svg>
);

export default function ContactUs() {
  return (
    <section className="py-20 relative" style={{ background: 'linear-gradient(to bottom, #ffffff, #f0f4ff)' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-600">
            We'd love to hear from you. Reach out to us with any questions or feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Contact Details</h3>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Email Us</h4>
                <p className="text-gray-600">contact@innovience.in</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Call Us</h4>
                <p className="text-gray-600">+91 8744915108</p>
                <p className="text-gray-600">+91 8252570419</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Location</h4>
                <p className="text-gray-600">KL University</p>
                <p className="text-gray-600">Green Fields, Vaddeswaram</p>
                <p className="text-gray-600">Andhra Pradesh 522302</p>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/innovience_interns?igsh=MWFkM3FsYzQ5MXo5ZQ==" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/company/innovience-intelligence/?viewAsMember=true" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://www.youtube.com/@Innovience" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <span className="sr-only">YouTube</span>
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="https://unstop.com/hackathons/code4change-kl-university-vijayawada-1436743" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <span className="sr-only">Unstop</span>
                  <UnstopIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Our Location</h3>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.963074827972!2d80.62421431487896!3d16.47298898862304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d944b%3A0x939b7e84ab4a0265!2sKL%20University!5e0!3m2!1sen!2sin!4v1623865643828!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="min-h-[400px]"
                title="KL University Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}