
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

interface CompanyGridProps {
  companies: string[];
  onCompanySelect: (company: string) => void;
}

const CompanyGrid: React.FC<CompanyGridProps> = ({ companies, onCompanySelect }) => {
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Format company name for display
  const formatCompanyName = (company: string) => {
    return company
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <motion.div
      className="mb-12"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Select a Company</h2>
        <p className="text-zinc-400">Choose a company to view their specific DSA questions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {companies.map((company, index) => (
          <motion.div
            key={company}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              onClick={() => onCompanySelect(company)}
              className="w-full h-auto p-6 bg-zinc-900/60 border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm rounded-xl group"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-white/10 to-zinc-800/30 border border-white/20 group-hover:border-blue-500/30 transition-colors">
                  <Building2 className="h-6 w-6 text-white group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-white font-semibold text-sm text-center group-hover:text-blue-300 transition-colors">
                  {formatCompanyName(company)}
                </span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CompanyGrid;
