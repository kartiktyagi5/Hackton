import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, BookOpen, Users, Award, Star, GraduationCap } from 'lucide-react';

const PrizeSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const prizeCards = [
    {
      title: "Top 5 Teams",
      icon: <Users className="w-8 h-8 text-white" />,
      color: "from-blue-500 to-blue-600",
      items: [
        {
          icon: <Code className="w-5 h-5 text-blue-200" />,
          text: "CodeChef Pro subscription (worth ₹1.25 lakh)",
          bold: true
        },
        {
          icon: <Award className="w-5 h-5 text-blue-200" />,
          text: "Free training at Innovience for internship opportunities",
          bold: true
        }
      ]
    },
    {
      title: "All Participants",
      icon: <BookOpen className="w-8 h-8 text-white" />,
      color: "from-purple-500 to-purple-600",
      items: [
        {
          icon: <GraduationCap className="w-5 h-5 text-purple-200" />,
          text: "Direct admission in IIT/IIM online courses",
          bold: true
        },
        {
          icon: <Star className="w-5 h-5 text-purple-200" />,
          text: "20-30% scholarship on all courses",
          bold: true
        }
      ]
    }
  ];

  return (
    <section id="prizes" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-32 h-32 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Exclusive Rewards
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Valuable opportunities to accelerate your learning and career
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {prizeCards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
              <div className="relative h-full bg-white rounded-2xl p-8 shadow-xl overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} rounded-bl-full opacity-10`}></div>
                <div className={`flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{card.title}</h3>
                <ul className="space-y-4">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-4">
                        {item.icon}
                      </div>
                      <p className={`${item.bold ? 'text-lg font-bold text-gray-800' : 'text-gray-700'}`}>
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
            <p className="text-base font-semibold text-gray-700">
              <span className="font-bold text-blue-600">All participants</span> will receive certificates and access to exclusive resources
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrizeSection;