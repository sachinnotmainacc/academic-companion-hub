
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from "@/components/ui/input"
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, Book, GraduationCap, Briefcase, Lightbulb, BarChart, Code, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  difficulty: string;
  topic: string;
  premium: boolean;
  popularity: number;
  acceptance: number;
}

const PlacementDSA: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedQuestionId, setCopiedQuestionId] = useState<number | null>(null);

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

  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://dsa-questions-api.vercel.app/questions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Question[] = await response.json();
      setQuestions(data);
      setFilteredQuestions(data); // Initially, show all questions
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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
      results = results.filter(q => q.topic === topicFilter);
    }

    setFilteredQuestions(results);
  }, [questions, searchTerm, difficultyFilter, topicFilter]);

  useEffect(() => {
    filterQuestions();
  }, [filterQuestions]);

  // Extract unique difficulties and topics for filter options
  const difficulties = ['All', ...new Set(questions.map(q => q.difficulty))];
  const topics = ['All', ...new Set(questions.map(q => q.topic))];

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <Lightbulb className="mr-2 h-6 w-6 animate-pulse text-yellow-500" />
        Loading questions...
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

  // Fix animation variants - use proper easing values
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Search and Filter Section */}
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

        {/* Questions Table */}
        <motion.div
          className="rounded-2xl overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <ScrollArea>
            <Table className="bg-zinc-900 border border-zinc-700 rounded-2xl">
              <TableCaption className="text-zinc-400">A list of DSA questions to prepare for placements.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">ID</TableHead>
                  <TableHead className="text-left">Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-right">Popularity</TableHead>
                  <TableHead className="text-right">Acceptance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow 
                    key={question.id}
                    className="transition-colors duration-200 hover:bg-zinc-800/50"
                  >
                    <TableCell className="font-medium text-center">{question.id}</TableCell>
                    <TableCell className="flex items-center justify-between">
                      {question.title}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-zinc-700/50 rounded-full"
                        onClick={() => handleCopyQuestion(question.id, question.title)}
                        disabled={copiedQuestionId === question.id}
                      >
                        {copiedQuestionId === question.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          question.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                            question.difficulty === 'Medium' ? 'bg-yellow-500 text-black' :
                              'bg-red-500 text-white'
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.topic}</TableCell>
                    <TableCell className="text-right">{question.popularity}</TableCell>
                    <TableCell className="text-right">{question.acceptance}</TableCell>
                  </TableRow>
                ))}
                {filteredQuestions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-400 italic">
                      No questions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </motion.div>

        {/* Stats Section */}
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

        {/* Key Features Section */}
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
      </main>

      <Footer />
    </div>
  );
};

export default PlacementDSA;
