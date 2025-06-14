
import { useState, useEffect } from 'react';
import { useCSVQuestions } from '../hooks/use-csv-questions';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Building2, Calendar, ExternalLink, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Question {
  ID: string;
  Title: string;
  Acceptance: string;
  Difficulty: 'Easy' | 'Medium' | 'Hard';
  Frequency: string;
  'Leetcode Question Link': string;
}

const PlacementDSA = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('alltime');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [quizMode, setQuizMode] = useState(false);

  const { questions, loading, error, companies } = useCSVQuestions(selectedCompany, selectedPeriod);

  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company);
    resetQuiz();
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    resetQuiz();
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setShowResults(false);
    setQuizMode(false);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setShowResults(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);

    if (isCorrect) {
      const newCorrect = new Set(correctAnswers);
      newCorrect.add(currentQuestionIndex);
      setCorrectAnswers(newCorrect);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrequencyLevel = (frequency: string): string => {
    const freq = parseFloat(frequency);
    if (freq > 1) return 'Very High';
    if (freq > 0.5) return 'High';
    if (freq > 0.1) return 'Medium';
    if (freq > 0) return 'Low';
    return 'Very Low';
  };

  const formatCompanyName = (company: string) => {
    return company
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPeriodName = (period: string) => {
    switch (period) {
      case '6months': return '6 Months';
      case '1year': return '1 Year';
      case '2year': return '2 Years';
      case 'alltime': return 'All Time';
      default: return period;
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const accuracy = answeredQuestions.size > 0 ? (correctAnswers.size / answeredQuestions.size) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center">
            <div className="text-white">Loading questions...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center">
            <div className="text-red-400">Error: {error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Placement DSA Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Practice with real interview questions from top tech companies
          </p>
        </div>

        {/* Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-dark-800 border-dark-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Filter Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <Select value={selectedCompany} onValueChange={handleCompanyChange}>
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      {companies.map((company) => (
                        <SelectItem key={company} value={company} className="text-white hover:bg-dark-600">
                          {formatCompanyName(company)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
                  <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      <SelectItem value="6months" className="text-white hover:bg-dark-600">6 Months</SelectItem>
                      <SelectItem value="1year" className="text-white hover:bg-dark-600">1 Year</SelectItem>
                      <SelectItem value="2year" className="text-white hover:bg-dark-600">2 Years</SelectItem>
                      <SelectItem value="alltime" className="text-white hover:bg-dark-600">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={startQuiz} 
                    disabled={questions.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Start Practice Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Mode */}
        {quizMode && currentQuestion && !showResults && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="bg-dark-800 border-dark-700">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-white">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                  <Badge variant="outline" className="text-white border-gray-600">
                    {formatCompanyName(selectedCompany)} - {formatPeriodName(selectedPeriod)}
                  </Badge>
                </div>
                <Progress value={progress} className="mb-4" />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Progress: {Math.round(progress)}%</span>
                  <span>Accuracy: {Math.round(accuracy)}%</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">{currentQuestion.Title}</h3>
                  <div className="flex gap-3 mb-4">
                    <Badge className={getDifficultyColor(currentQuestion.Difficulty)}>
                      {currentQuestion.Difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      {currentQuestion.Acceptance}
                    </Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      Frequency: {getFrequencyLevel(currentQuestion.Frequency)}
                    </Badge>
                  </div>
                </div>

                <div className="bg-dark-700 p-4 rounded-lg">
                  <p className="text-gray-300 mb-4">
                    Have you solved this problem before or do you know the solution approach?
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => handleAnswer(true)}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Yes, I can solve it
                    </Button>
                    <Button 
                      onClick={() => handleAnswer(false)}
                      className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      No, I need to study this
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <a 
                    href={currentQuestion['Leetcode Question Link']} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on LeetCode
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz Results */}
        {showResults && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="bg-dark-800 border-dark-700">
              <CardHeader>
                <CardTitle className="text-white text-center text-2xl">Quiz Complete!</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Here's how you performed on {formatCompanyName(selectedCompany)} questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-dark-700 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">{correctAnswers.size}</div>
                    <div className="text-gray-300">Questions Known</div>
                  </div>
                  <div className="bg-dark-700 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {answeredQuestions.size - correctAnswers.size}
                    </div>
                    <div className="text-gray-300">Need to Study</div>
                  </div>
                  <div className="bg-dark-700 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{Math.round(accuracy)}%</div>
                    <div className="text-gray-300">Accuracy</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={resetQuiz}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Take Another Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Questions List */}
        {!quizMode && questions.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <Card className="bg-dark-800 border-dark-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {formatCompanyName(selectedCompany)} Questions ({formatPeriodName(selectedPeriod)})
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {questions.length} questions found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={index} className="bg-dark-700 p-4 rounded-lg border border-dark-600 hover:border-dark-500 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white">{question.Title}</h3>
                        <a 
                          href={question['Leetcode Question Link']} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getDifficultyColor(question.Difficulty)}>
                          {question.Difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          {question.Acceptance}
                        </Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          Frequency: {getFrequencyLevel(question.Frequency)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {questions.length === 0 && selectedCompany && (
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-dark-800 border-dark-700">
              <CardContent className="py-12">
                <p className="text-gray-400 text-lg">
                  No questions found for {formatCompanyName(selectedCompany)} in the {formatPeriodName(selectedPeriod)} period.
                </p>
                <p className="text-gray-500 mt-2">
                  Try selecting a different time period or company.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PlacementDSA;
