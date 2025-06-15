
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (difficulty: string) => void;
  topicFilter: string;
  setTopicFilter: (topic: string) => void;
  difficulties: string[];
  topics: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  difficultyFilter,
  setDifficultyFilter,
  topicFilter,
  setTopicFilter,
  difficulties,
  topics
}) => {
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

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <Input
        type="text"
        placeholder="Search questions..."
        className="bg-zinc-900 border-zinc-700 text-white shadow-none focus-visible:ring-zinc-600 focus-visible:border-zinc-600"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="bg-zinc-900 border-zinc-700 text-white rounded-md py-2 px-3 shadow-none focus-visible:ring-zinc-600 focus-visible:border-zinc-600"
        value={difficultyFilter}
        onChange={(e) => setDifficultyFilter(e.target.value)}
      >
        {difficulties.map(difficulty => (
          <option key={difficulty} value={difficulty}>{difficulty}</option>
        ))}
      </select>
      <select
        className="bg-zinc-900 border-zinc-700 text-white rounded-md py-2 px-3 shadow-none focus-visible:ring-zinc-600 focus-visible:border-zinc-600"
        value={topicFilter}
        onChange={(e) => setTopicFilter(e.target.value)}
      >
        {topics.map(topic => (
          <option key={topic} value={topic}>{topic}</option>
        ))}
      </select>
    </motion.div>
  );
};

export default SearchFilters;
