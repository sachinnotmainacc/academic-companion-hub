
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion, Variants } from 'framer-motion';
import { GraduationCap, Lightbulb, XCircle, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchFilters from '@/components/placement-dsa/SearchFilters';
import QuestionsTable from '@/components/placement-dsa/QuestionsTable';
import StatsSection from '@/components/placement-dsa/StatsSection';
import FeaturesSection from '@/components/placement-dsa/FeaturesSection';
import CompanyGrid from '@/components/placement-dsa/CompanyGrid';
import { useCSVQuestions, QuestionData } from '@/hooks/use-csv-questions';

const PlacementDSA: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionData[]>([]);
  const [copiedQuestionId, setCopiedQuestionId] = useState<number | null>(null);
  const [companySearchTerm, setCompanySearchTerm] = useState('');

  // Use the CSV questions hook
  const { questions, isLoading, error, companies } = useCSVQuestions(selectedCompany);

  const cardVariants: Variants = {
    hidden: { 
      y: 50, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.3
      }
    }
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(companySearchTerm.toLowerCase())
  );

  // Function to handle copying question title
  const handleCopyQuestion = (questionId: number, questionTitle: string) => {
    navigator.clipboard.writeText(questionTitle)
      .then(() => {
        setCopiedQuestionId(questionId);
        toast.success("Question copied to clipboard!", {
          duration: 2000,
        });
        setTimeout(() => {
          setCopiedQuestionId(null);
        }, 3000);
      })
      .catch(err => {
        console.error("Failed to copy question: ", err);
        toast.error("Failed to copy question.", {
          duration: 2000,
        });
      });
  };

  // Function to filter questions
  const filterQuestions = useCallback(() => {
    let results = questions;

    // Filter by search term
    if (searchTerm) {
      results = results.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== 'All') {
      results = results.filter(q => q.difficulty === difficultyFilter);
    }

    // Filter by topic
    if (topicFilter !== 'All') {
      results = results.filter(q => q.topics.includes(topicFilter));
    }

    setFilteredQuestions(results);
  }, [questions, searchTerm, difficultyFilter, topicFilter]);

  useEffect(() => {
    filterQuestions();
  }, [filterQuestions]);

  // Extract unique difficulties and topics for filter options
  const difficulties = ['All', ...new Set(questions.map(q => q.difficulty))];
  const allTopics = questions.flatMap(q => q.topics);
  const topics = ['All', ...new Set(allTopics)];

  // Function to handle company selection
  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setSearchTerm('');
    setDifficultyFilter('All');
    setTopicFilter('All');
  };

  // Function to go back to company selection
  const handleBackToCompanies = () => {
    setSelectedCompany('');
    setSearchTerm('');
    setDifficultyFilter('All');
    setTopicFilter('All');
    setCompanySearchTerm('');
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <Lightbulb className="mr-2 h-6 w-6 animate-pulse text-yellow-500" />
        Loading...
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-500">
        <XCircle className="mr-2 h-6 w-6" />
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-black to-zinc-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/1 rounded-full blur-3xl"></div>

      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-white/10 to-zinc-800/30 border border-white/20 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              Placement DSA Questions
            </h1>
          </div>
          <p className="text-zinc-400">Ace your coding interviews with our curated list of DSA questions</p>
        </motion.div>

        {!selectedCompany ? (
          /* Company Selection View */
          <>
            {/* Company Search Box */}
            <motion.div
              className="mb-8 max-w-md mx-auto"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search companies..."
                  value={companySearchTerm}
                  onChange={(e) => setCompanySearchTerm(e.target.value)}
                  className="pl-10 bg-zinc-900/60 border-zinc-700/50 text-white placeholder:text-zinc-400 focus:border-blue-500/50 rounded-xl"
                />
              </div>
            </motion.div>

            <CompanyGrid 
              companies={filteredCompanies} 
              onCompanySelect={handleCompanySelect}
            />
          </>
        ) : (
          /* Questions View for Selected Company */
          <>
            {/* Back Button */}
            <motion.div
              className="mb-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={handleBackToCompanies}
                variant="outline"
                className="flex items-center gap-2 bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Companies
              </Button>
              <h2 className="text-2xl font-bold mt-4 mb-2 capitalize">
                {selectedCompany.replace('-', ' ')} Questions
              </h2>
              <p className="text-zinc-400">
                {questions.length} questions available for {selectedCompany.replace('-', ' ')}
              </p>
            </motion.div>

            {/* Search and Filter Section */}
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              difficultyFilter={difficultyFilter}
              setDifficultyFilter={setDifficultyFilter}
              topicFilter={topicFilter}
              setTopicFilter={setTopicFilter}
              difficulties={difficulties}
              topics={topics}
            />

            {/* Questions Table */}
            <QuestionsTable
              filteredQuestions={filteredQuestions}
              copiedQuestionId={copiedQuestionId}
              handleCopyQuestion={handleCopyQuestion}
            />

            {/* Stats Section */}
            <StatsSection questions={questions} />
          </>
        )}

        {/* Key Features Section - only show when no company is selected */}
        {!selectedCompany && <FeaturesSection />}
      </main>

      <Footer />
    </div>
  );
};

export default PlacementDSA;
