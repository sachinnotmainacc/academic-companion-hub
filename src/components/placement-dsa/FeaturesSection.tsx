import React from 'react';
import { motion } from 'framer-motion';
import { Book, BarChart, Code, MessageSquare } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const featureVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
      variants={featureVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 1.0, duration: 0.3 }}
    >
      <div className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Book className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Comprehensive Questions</h3>
        </div>
        <p className="text-zinc-400">A wide range of DSA questions covering various topics.</p>
      </div>
      <div className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart className="h-6 w-6 text-purple-500" />
          <h3 className="text-lg font-semibold text-white">Stats and Analysis</h3>
        </div>
        <p className="text-zinc-400">Track question popularity and acceptance rates.</p>
      </div>
      <div className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">Filter by Topic</h3>
        </div>
        <p className="text-zinc-400">Easily filter questions by specific data structures or algorithms.</p>
      </div>
      <div className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-6 w-6 text-teal-500" />
          <h3 className="text-lg font-semibold text-white">Community Support</h3>
        </div>
        <p className="text-zinc-400">Discuss questions and solutions with other users.</p>
      </div>
    </motion.div>
  );
};

export default FeaturesSection;
