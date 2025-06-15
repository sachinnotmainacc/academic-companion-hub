
import React from 'react';
import { motion } from 'framer-motion';
import { QuestionData } from '@/hooks/use-csv-questions';

interface StatsSectionProps {
  questions: QuestionData[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ questions }) => {
  const statsVariants = {
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
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
      variants={statsVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.8, duration: 0.3 }}
    >
      <div className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-lg p-6 text-center">
        <div className="text-4xl font-bold text-green-500 mb-2">
          {questions.filter(q => q.difficulty === 'Easy').length}
        </div>
        <div className="text-zinc-400 uppercase font-medium tracking-wider">Easy Questions</div>
      </div>
      <div className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-lg p-6 text-center">
        <div className="text-4xl font-bold text-yellow-500 mb-2">
          {questions.filter(q => q.difficulty === 'Medium').length}
        </div>
        <div className="text-zinc-400 uppercase font-medium tracking-wider">Medium Questions</div>
      </div>
      <div className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-lg p-6 text-center">
        <div className="text-4xl font-bold text-red-500 mb-2">
          {questions.filter(q => q.difficulty === 'Hard').length}
        </div>
        <div className="text-zinc-400 uppercase font-medium tracking-wider">Hard Questions</div>
      </div>
    </motion.div>
  );
};

export default StatsSection;
