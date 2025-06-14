
import React, { useState, useEffect } from 'react';
import { useCSVQuestions } from '@/hooks/use-csv-questions';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Brain, 
  Code, 
  Target, 
  Trophy, 
  Clock, 
  BarChart3, 
  Shuffle, 
  ChevronRight,
  Zap,
  Star,
  TrendingUp,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  title: string;
  difficulty: string;
  frequency: number;
  link: string;
  acceptance: string;
}

const PlacementDSA = () => {
  const [selectedCompany, setSelectedCompany] = useState('google');
  const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set());
  
  const { questions, isLoading, error } = useCSVQuestions(selectedCompany, selectedTimeframe);

  // Load solved questions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('solved-questions');
    if (saved) {
      setSolvedQuestions(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save solved questions to localStorage
  useEffect(() => {
    localStorage.setItem('solved-questions', JSON.stringify([...solvedQuestions]));
  }, [solvedQuestions]);

  const companies = [
    { id: 'google', name: 'Google', color: 'bg-blue-500' },
    { id: 'amazon', name: 'Amazon', color: 'bg-orange-500' },
    { id: 'microsoft', name: 'Microsoft', color: 'bg-green-500' },
    { id: 'facebook', name: 'Meta', color: 'bg-blue-600' },
    { id: 'apple', name: 'Apple', color: 'bg-gray-600' },
    { id: 'netflix', name: 'Netflix', color: 'bg-red-500' },
    { id: 'uber', name: 'Uber', color: 'bg-black' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
  ];

  const timeframes = [
    { id: 'All Time', name: 'All Time' },
    { id: '2 Years', name: 'Last 2 Years' },
    { id: '1 Year', name: 'Last Year' },
    { id: '6 Months', name: 'Last 6 Months' },
  ];

  const filteredQuestions = questions.filter(q => 
    difficultyFilter === 'all' || q.difficulty.toLowerCase() === difficultyFilter
  );

  const getRandomQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentQuestionIndex(randomIndex);
    toast.success('New random question selected!');
  };

  const markAsSolved = (questionId: string) => {
    setSolvedQuestions(prev => new Set([...prev, questionId]));
    toast.success('Question marked as solved! 🎉');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const solvedCount = questions.filter(q => solvedQuestions.has(q.id)).length;
  const progressPercentage = questions.length > 0 ? (solvedCount / questions.length) * 100 : 0;

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <Code className="h-12 w-12 text-blue-400" />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                  Placement DSA
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl">
                  Master data structures and algorithms with curated questions from top tech companies
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-6 border border-dark-700/50">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-white">{solvedCount}</div>
                <div className="text-sm text-gray-400">Solved</div>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-6 border border-dark-700/50">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-white">{questions.length}</div>
                <div className="text-sm text-gray-400">Total Questions</div>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-6 border border-dark-700/50">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-gray-400">Progress</div>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-6 border border-dark-700/50">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-white">{companies.length}</div>
                <div className="text-sm text-gray-400">Companies</div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-dark-800/50 backdrop-blur-xl rounded-3xl border border-dark-700/50 shadow-2xl mb-12 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Customize Your Practice</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Company
                  </label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id} className="text-white hover:bg-dark-600">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${company.color}`}></div>
                            {company.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeframe
                  </label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      {timeframes.map(timeframe => (
                        <SelectItem key={timeframe.id} value={timeframe.id} className="text-white hover:bg-dark-600">
                          {timeframe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Difficulty
                  </label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      <SelectItem value="all" className="text-white hover:bg-dark-600">All Difficulties</SelectItem>
                      <SelectItem value="easy" className="text-white hover:bg-dark-600">Easy</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-dark-600">Medium</SelectItem>
                      <SelectItem value="hard" className="text-white hover:bg-dark-600">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={getRandomQuestion}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  disabled={filteredQuestions.length === 0}
                >
                  <Shuffle className="mr-2 h-5 w-5" />
                  Get Random Question
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Current Question */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading questions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30 inline-block mb-4">
                <Code className="h-12 w-12 text-red-400" />
              </div>
              <p className="text-red-400 text-lg mb-2">Error loading questions</p>
              <p className="text-gray-400">{error}</p>
            </div>
          ) : currentQuestion ? (
            <Card className="bg-dark-800/50 backdrop-blur-xl border-dark-700/50 shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} border`}>
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                        Frequency: {currentQuestion.frequency}
                      </Badge>
                      {solvedQuestions.has(currentQuestion.id) && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          ✓ Solved
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl text-white leading-tight">
                      {currentQuestion.title}
                    </CardTitle>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Question</div>
                    <div className="text-2xl font-bold text-white">
                      {currentQuestionIndex + 1} / {filteredQuestions.length}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <a href={currentQuestion.link} target="_blank" rel="noopener noreferrer">
                      <Code className="mr-2 h-5 w-5" />
                      Solve on LeetCode
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  
                  {!solvedQuestions.has(currentQuestion.id) && (
                    <Button 
                      onClick={() => markAsSolved(currentQuestion.id)}
                      variant="outline"
                      className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50 h-14 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Mark as Solved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16">
              <div className="p-4 rounded-2xl bg-gray-500/20 border border-gray-500/30 inline-block mb-4">
                <Target className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">No questions found for the selected filters</p>
            </div>
          )}

          {/* Progress Section */}
          {questions.length > 0 && (
            <div className="mt-16 bg-dark-800/50 backdrop-blur-xl rounded-3xl border border-dark-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Your Progress</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Overall Progress</span>
                  <span className="text-white font-semibold">{solvedCount} / {questions.length}</span>
                </div>
                
                <div className="w-full bg-dark-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-400 text-center">
                  Keep going! You've solved {Math.round(progressPercentage)}% of questions from {companies.find(c => c.id === selectedCompany)?.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlacementDSA;
