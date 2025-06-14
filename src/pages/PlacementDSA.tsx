
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCsvQuestions } from '@/hooks/use-csv-questions';
import { 
  Code2, 
  Building2, 
  Calendar,
  ExternalLink,
  Filter,
  Search,
  TrendingUp,
  Target,
  BookOpen
} from 'lucide-react';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  link: string;
  frequency: number;
  company: string;
  timeRange: string;
}

const PlacementDSA = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('alltime');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [questionsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const { questions, loading, error, companies, timeRanges } = useCsvQuestions();

  // Filter and paginate questions
  useEffect(() => {
    if (questions.length === 0) return;

    let filtered = questions.filter(q => {
      const matchesCompany = selectedCompany === 'all' || q.company === selectedCompany;
      const matchesTimeRange = selectedTimeRange === 'all' || q.timeRange === selectedTimeRange;
      const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchesSearch = searchTerm === '' || 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCompany && matchesTimeRange && matchesDifficulty && matchesSearch;
    });

    // Sort by frequency (descending)
    filtered.sort((a, b) => b.frequency - a.frequency);

    // Paginate
    const endIndex = currentPage * questionsPerPage;
    setDisplayedQuestions(filtered.slice(0, endIndex));
  }, [questions, selectedCompany, selectedTimeRange, selectedDifficulty, searchTerm, currentPage]);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  };

  const resetFilters = () => {
    setSelectedCompany('all');
    setSelectedTimeRange('alltime');
    setSelectedDifficulty('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/10 text-green-400 border-green-400/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20';
      case 'Hard':
        return 'bg-red-500/10 text-red-400 border-red-400/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-400/20';
    }
  };

  const getStats = () => {
    const totalQuestions = displayedQuestions.length;
    const easyCount = displayedQuestions.filter(q => q.difficulty === 'Easy').length;
    const mediumCount = displayedQuestions.filter(q => q.difficulty === 'Medium').length;
    const hardCount = displayedQuestions.filter(q => q.difficulty === 'Hard').length;
    
    return { totalQuestions, easyCount, mediumCount, hardCount };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading placement questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading questions: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
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
      
      <main className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-zinc-800/30 border border-white/20 backdrop-blur-sm">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-lg">
                Placement DSA
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-zinc-400 mx-auto mt-4 mb-4"></div>
              <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
                Curated coding questions from top tech companies to ace your interviews
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-400" />
                <span className="text-2xl font-bold text-white">{stats.totalQuestions}</span>
              </div>
              <p className="text-zinc-400 text-sm">Total Questions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-2xl font-bold text-green-400">{stats.easyCount}</span>
              </div>
              <p className="text-zinc-400 text-sm">Easy</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-2xl font-bold text-yellow-400">{stats.mediumCount}</span>
              </div>
              <p className="text-zinc-400 text-sm">Medium</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-2xl font-bold text-red-400">{stats.hardCount}</span>
              </div>
              <p className="text-zinc-400 text-sm">Hard</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Company</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company} value={company} className="text-white">
                        {company.charAt(0).toUpperCase() + company.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Time Range</label>
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="alltime">All Time</SelectItem>
                    {timeRanges.map(range => (
                      <SelectItem key={range} value={range} className="text-white">
                        {range === '6months' ? '6 Months' : 
                         range === '1year' ? '1 Year' : 
                         range === '2year' ? '2 Years' : range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Easy" className="text-white">Easy</SelectItem>
                    <SelectItem value="Medium" className="text-white">Medium</SelectItem>
                    <SelectItem value="Hard" className="text-white">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={resetFilters} variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700/80">
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4 mb-8">
          {displayedQuestions.map((question, index) => (
            <Card key={`${question.id}-${index}`} className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 backdrop-blur-xl hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {question.title}
                      </h3>
                      <Badge className={`${getDifficultyColor(question.difficulty)} border text-xs font-medium`}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span className="capitalize">{question.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{question.timeRange === 'alltime' ? 'All Time' : question.timeRange}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>Frequency: {question.frequency}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {question.topics.slice(0, 5).map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="border-zinc-600 text-zinc-300 text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {question.topics.length > 5 && (
                        <Badge variant="outline" className="border-zinc-600 text-zinc-300 text-xs">
                          +{question.topics.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button asChild size="sm" className="bg-white text-black hover:bg-zinc-200 transition-all duration-300">
                    <a href={question.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Solve
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {displayedQuestions.length < questions.filter(q => {
          const matchesCompany = selectedCompany === 'all' || q.company === selectedCompany;
          const matchesTimeRange = selectedTimeRange === 'all' || q.timeRange === selectedTimeRange;
          const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
          const matchesSearch = searchTerm === '' || 
            q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
          return matchesCompany && matchesTimeRange && matchesDifficulty && matchesSearch;
        }).length && (
          <div className="text-center">
            <Button 
              onClick={loadMore} 
              disabled={loadingMore}
              size="lg"
              className="bg-white text-black hover:bg-zinc-200 transition-all duration-300"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Load More Questions
                </>
              )}
            </Button>
          </div>
        )}

        {displayedQuestions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 inline-block mb-4">
              <Search className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No questions found</h3>
            <p className="text-zinc-400 mb-4">Try adjusting your filters or search terms</p>
            <Button onClick={resetFilters} className="bg-white text-black hover:bg-zinc-200">
              Reset Filters
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PlacementDSA;
