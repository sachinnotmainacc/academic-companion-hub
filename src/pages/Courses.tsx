import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, Clock, Users, Star, BookOpen, Zap, Trophy, Code, Search, Brain, Palette, Database, Shield, Smartphone, Globe, Calculator, Filter, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

type Category = "all" | "web-dev" | "data-science" | "mobile" | "cybersecurity" | "design" | "algorithms" | "ai-ml";

const categories = [
  { id: "all" as Category, label: "All Courses" },
  { id: "web-dev" as Category, label: "Web Development" },
  { id: "data-science" as Category, label: "Data Science" },
  { id: "mobile" as Category, label: "Mobile Development" },
  { id: "cybersecurity" as Category, label: "Cybersecurity" },
  { id: "design" as Category, label: "Design" },
  { id: "algorithms" as Category, label: "Algorithms & CS" },
  { id: "ai-ml" as Category, label: "AI & Machine Learning" }
];

const courses = [
  {
    title: "Complete Web Development Bootcamp",
    provider: "The Odin Project",
    duration: "6-9 months",
    level: "Beginner",
    rating: 4.8,
    students: "50k+",
    description: "Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, and Node.js. This comprehensive curriculum includes hands-on projects, real-world applications, and industry best practices. Build a complete portfolio with multiple full-stack applications.",
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js", "Databases", "Git", "Testing"],
    link: "https://www.theodinproject.com/",
    price: "Free",
    icon: <Code className="h-6 w-6 text-blue-400" />,
    gradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
    category: "web-dev" as Category,
  },
  {
    title: "CS50: Introduction to Computer Science",
    provider: "Harvard University",
    duration: "10-20 hours/week",
    level: "Beginner",
    rating: 4.9,
    students: "100k+",
    description: "Harvard's legendary introduction to computer science and programming. Covers fundamental concepts including algorithms, data structures, memory management, software engineering, and web development. Features problem sets inspired by real-world domains including biology, cryptography, finance, forensics, and gaming.",
    topics: ["C", "Python", "SQL", "JavaScript", "Algorithms", "Data Structures", "Memory Management"],
    link: "https://cs50.harvard.edu/x/",
    price: "Free",
    icon: <Trophy className="h-6 w-6 text-yellow-400" />,
    gradient: "from-yellow-600/20 to-orange-600/20",
    borderColor: "border-yellow-500/30",
    category: "algorithms" as Category,
  },
  {
    title: "freeCodeCamp",
    provider: "freeCodeCamp",
    duration: "300+ hours",
    level: "All Levels",
    rating: 4.7,
    students: "400k+",
    description: "Comprehensive curriculum covering web development, data science, and machine learning. Earn certifications by building real projects for nonprofits. Interactive lessons, coding challenges, and a supportive community. Covers responsive web design, JavaScript algorithms, frontend libraries, data visualization, APIs, and microservices.",
    topics: ["Web Development", "Data Science", "APIs", "Microservices", "Machine Learning", "Python", "JavaScript"],
    link: "https://www.freecodecamp.org/",
    price: "Free",
    icon: <Zap className="h-6 w-6 text-green-400" />,
    gradient: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
    category: "web-dev" as Category,
  },
  {
    title: "JavaScript30",
    provider: "Wes Bos",
    duration: "30 days",
    level: "Intermediate",
    rating: 4.8,
    students: "200k+",
    description: "Build 30 things in 30 days with vanilla JavaScript. No frameworks, libraries, or compilers required. Learn DOM manipulation, event handling, AJAX, and modern ES6+ features through practical projects including a drum kit, clock, speech synthesis, and webcam fun applications.",
    topics: ["Vanilla JavaScript", "DOM Manipulation", "CSS", "APIs", "Local Storage", "ES6+", "Audio/Video APIs"],
    link: "https://javascript30.com/",
    price: "Free",
    icon: <BookOpen className="h-6 w-6 text-purple-400" />,
    gradient: "from-purple-600/20 to-violet-600/20",
    borderColor: "border-purple-500/30",
    category: "web-dev" as Category,
  },
  {
    title: "Python for Data Science and AI",
    provider: "IBM (Coursera)",
    duration: "25 hours",
    level: "Beginner",
    rating: 4.6,
    students: "300k+",
    description: "Comprehensive introduction to Python programming for data science and artificial intelligence. Learn Python basics, data structures, pandas, NumPy, matplotlib, and machine learning fundamentals. Includes hands-on labs and real-world data analysis projects.",
    topics: ["Python", "Pandas", "NumPy", "Matplotlib", "Data Analysis", "Machine Learning", "Jupyter"],
    link: "https://www.coursera.org/learn/python-for-applied-data-science-ai",
    price: "Free (Audit)",
    icon: <Brain className="h-6 w-6 text-cyan-400" />,
    gradient: "from-cyan-600/20 to-blue-600/20",
    borderColor: "border-cyan-500/30",
    category: "data-science" as Category,
  },
  {
    title: "Machine Learning Course",
    provider: "Andrew Ng (Stanford)",
    duration: "11 weeks",
    level: "Intermediate",
    rating: 4.9,
    students: "4.8M+",
    description: "The most popular machine learning course online. Learn supervised and unsupervised learning, neural networks, support vector machines, and best practices. Includes programming assignments in Octave/MATLAB and real-world case studies from Silicon Valley.",
    topics: ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "SVM", "Anomaly Detection", "Recommender Systems"],
    link: "https://www.coursera.org/learn/machine-learning",
    price: "Free (Audit)",
    icon: <Brain className="h-6 w-6 text-purple-400" />,
    gradient: "from-purple-600/20 to-indigo-600/20",
    borderColor: "border-purple-500/30",
    category: "ai-ml" as Category,
  },
  {
    title: "React Native for Mobile Development",
    provider: "Meta (Coursera)",
    duration: "7 months",
    level: "Intermediate",
    rating: 4.5,
    students: "50k+",
    description: "Learn to build cross-platform mobile applications using React Native. Cover navigation, state management, API integration, and publishing to app stores. Build real projects including a restaurant app and a portfolio app with authentication and data persistence.",
    topics: ["React Native", "Mobile UI", "Navigation", "State Management", "APIs", "Publishing", "Testing"],
    link: "https://www.coursera.org/professional-certificates/meta-react-native-developer",
    price: "Free (Audit)",
    icon: <Smartphone className="h-6 w-6 text-green-400" />,
    gradient: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
    category: "mobile" as Category,
  },
  {
    title: "Cybersecurity Fundamentals",
    provider: "Rochester Institute of Technology",
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.7,
    students: "120k+",
    description: "Introduction to cybersecurity principles, threats, and countermeasures. Learn about network security, cryptography, digital forensics, and ethical hacking. Includes hands-on labs with security tools and real-world scenarios.",
    topics: ["Network Security", "Cryptography", "Digital Forensics", "Ethical Hacking", "Risk Assessment", "Security Tools"],
    link: "https://www.edx.org/course/cybersecurity-fundamentals",
    price: "Free",
    icon: <Shield className="h-6 w-6 text-red-400" />,
    gradient: "from-red-600/20 to-pink-600/20",
    borderColor: "border-red-500/30",
    category: "cybersecurity" as Category,
  },
  {
    title: "UI/UX Design Specialization",
    provider: "University of Minnesota",
    duration: "6 months",
    level: "Beginner",
    rating: 4.6,
    students: "80k+",
    description: "Learn user interface and user experience design from scratch. Cover design thinking, prototyping, user research, and usability testing. Use industry-standard tools and build a complete design portfolio with real client projects.",
    topics: ["Design Thinking", "Prototyping", "User Research", "Usability Testing", "Figma", "Adobe XD", "Design Systems"],
    link: "https://www.coursera.org/specializations/ui-ux-design",
    price: "Free (Audit)",
    icon: <Palette className="h-6 w-6 text-pink-400" />,
    gradient: "from-pink-600/20 to-rose-600/20",
    borderColor: "border-pink-500/30",
    category: "design" as Category,
  },
  {
    title: "Database Systems",
    provider: "Stanford University",
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.8,
    students: "75k+",
    description: "Comprehensive course on database design, implementation, and management. Learn SQL, NoSQL, database modeling, indexing, transactions, and distributed systems. Includes practical projects with real databases and performance optimization.",
    topics: ["SQL", "NoSQL", "Database Design", "Indexing", "Transactions", "Distributed Systems", "Performance Optimization"],
    link: "https://www.edx.org/course/databases-5-sql",
    price: "Free",
    icon: <Database className="h-6 w-6 text-indigo-400" />,
    gradient: "from-indigo-600/20 to-blue-600/20",
    borderColor: "border-indigo-500/30",
    category: "data-science" as Category,
  },
  {
    title: "Algorithms and Data Structures",
    provider: "Princeton University",
    duration: "12 weeks",
    level: "Intermediate",
    rating: 4.9,
    students: "200k+",
    description: "Essential algorithms and data structures for competitive programming and technical interviews. Cover sorting, searching, graph algorithms, dynamic programming, and complexity analysis. Includes coding assignments in Java and real interview problems.",
    topics: ["Sorting Algorithms", "Graph Theory", "Dynamic Programming", "Trees", "Hash Tables", "Big O Notation", "Interview Prep"],
    link: "https://www.coursera.org/learn/algorithms-part1",
    price: "Free (Audit)",
    icon: <Calculator className="h-6 w-6 text-orange-400" />,
    gradient: "from-orange-600/20 to-yellow-600/20",
    borderColor: "border-orange-500/30",
    category: "algorithms" as Category,
  },
  {
    title: "Deep Learning Specialization",
    provider: "Andrew Ng (DeepLearning.AI)",
    duration: "4 months",
    level: "Advanced",
    rating: 4.8,
    students: "500k+",
    description: "Master deep learning and neural networks. Build and train deep neural networks, implement vectorized neural networks, and work with CNNs, RNNs, and LSTMs. Includes projects on image recognition, natural language processing, and generative AI.",
    topics: ["Neural Networks", "CNNs", "RNNs", "LSTMs", "Computer Vision", "NLP", "TensorFlow", "Keras"],
    link: "https://www.coursera.org/specializations/deep-learning",
    price: "Free (Audit)",
    icon: <Brain className="h-6 w-6 text-violet-400" />,
    gradient: "from-violet-600/20 to-purple-600/20",
    borderColor: "border-violet-500/30",
    category: "ai-ml" as Category,
  },
  {
    title: "Full Stack Open",
    provider: "University of Helsinki",
    duration: "14 weeks",
    level: "Intermediate",
    rating: 4.9,
    students: "300k+",
    description: "Modern web development with React, Redux, Node.js, MongoDB, and GraphQL. Build full-stack applications with authentication, testing, and deployment. Includes advanced topics like TypeScript, React Native, and CI/CD pipelines.",
    topics: ["React", "Redux", "Node.js", "MongoDB", "GraphQL", "TypeScript", "Testing", "CI/CD"],
    link: "https://fullstackopen.com/",
    price: "Free",
    icon: <Globe className="h-6 w-6 text-teal-400" />,
    gradient: "from-teal-600/20 to-cyan-600/20",
    borderColor: "border-teal-500/30",
    category: "web-dev" as Category,
  },
  {
    title: "MIT OpenCourseWare",
    provider: "Massachusetts Institute of Technology",
    duration: "Self-paced",
    level: "Advanced",
    rating: 4.9,
    students: "Unlimited",
    description: "Free access to MIT's course materials including lectures, assignments, and exams across computer science, mathematics, and engineering. Features advanced topics like distributed systems, artificial intelligence, linear algebra, and computational thinking with real MIT problem sets.",
    topics: ["Computer Science", "Mathematics", "Engineering", "Economics", "Physics", "AI", "Distributed Systems"],
    link: "https://ocw.mit.edu/",
    price: "Free",
    icon: <Trophy className="h-6 w-6 text-red-400" />,
    gradient: "from-red-600/20 to-pink-600/20",
    borderColor: "border-red-500/30",
    category: "algorithms" as Category,
  }
];

const levelColors = {
  Beginner: "bg-green-500/20 text-green-300 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-300 border-red-500/30",
  "All Levels": "bg-blue-500/20 text-blue-300 border-blue-500/30"
};

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    let filtered = selectedCategory === "all" 
      ? courses 
      : courses.filter(course => course.category === selectedCategory);

    if (searchQuery.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        course.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All Courses";
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.name : "All Courses";
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-4 backdrop-blur-sm">
            <BookOpen className="h-4 w-4" />
            Free Learning Resources
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Master Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Technical Skills
            </span>
          </h1>
          
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium">
            Curated collection of the best free courses and resources to advance your 
            programming and computer science knowledge across multiple disciplines.
          </p>
          
          <div className="flex items-center justify-center gap-8 pt-6">
            <div className="flex items-center gap-2 text-green-400">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-semibold text-white">100% Free</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Users className="h-5 w-5" />
              <span className="text-sm font-semibold text-white">Self-Paced</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-semibold text-white">High Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Category Filter Dropdown */}
            <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 text-white hover:bg-zinc-700/80 justify-between min-w-[200px] transition-all duration-300 hover:shadow-lg hover:border-zinc-600/50"
                  variant="outline"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {getSelectedCategoryName()}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2 transition-all duration-300 ease-in-out">
                <Card className="bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 border-zinc-700/50 backdrop-blur-xl shadow-2xl animate-fade-in">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {categories.map(category => (
                        <Button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setIsFilterOpen(false);
                          }}
                          className={`h-12 transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id 
                            ? 'bg-white text-black hover:bg-zinc-200 shadow-md' 
                            : 'bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700/80'
                          } rounded-xl text-sm`}
                        >
                          {category.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {/* Enhanced Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search courses, topics, or providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-zinc-800/70 focus:bg-zinc-800/70 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mt-6">
            <p className="text-gray-400 font-medium">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              {searchQuery && (
                <span className="text-blue-400"> for "{searchQuery}"</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <Card 
                key={index} 
                className={`group bg-gray-900/60 border border-gray-800/50 hover:border-gray-600/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-xl rounded-2xl overflow-hidden h-full flex flex-col hover:scale-[1.02] animate-fade-in`}
                style={{
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-2xl`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <CardHeader className="pb-4 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-gray-800/80 border border-gray-700/60 group-hover:border-gray-600/60 transition-all duration-500 backdrop-blur-sm shadow-lg">
                        {course.icon}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Badge className={`text-xs font-semibold border ${levelColors[course.level as keyof typeof levelColors]}`}>
                          {course.level}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-400">
                            {course.price}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-bold text-white tracking-tight leading-tight mb-2">
                      {course.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed font-medium line-clamp-4">
                      {course.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 px-6 flex-grow">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">What you'll learn:</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.topics.slice(0, 4).map((topic, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="text-xs text-gray-300 border-gray-700/60 bg-gray-800/40 hover:bg-gray-800/60 transition-colors"
                            >
                              {topic}
                            </Badge>
                          ))}
                          {course.topics.length > 4 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs text-blue-400 border-blue-500/30 bg-blue-500/10"
                            >
                              +{course.topics.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-800/60">
                        <p className="text-xs text-gray-400 font-medium">
                          <span className="text-blue-400 font-semibold">Provider:</span> {course.provider}
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <div className="p-6 pt-4 mt-auto">
                    <Button 
                      className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 rounded-xl text-sm" 
                      onClick={() => window.open(course.link, '_blank')}
                    >
                      Start Learning
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800/60 backdrop-blur-xl max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}
          
          {/* Call to Action */}
          <div className="mt-20 text-center p-10 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800/60 backdrop-blur-xl shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to start your learning journey?
            </h3>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto font-medium leading-relaxed text-lg">
              These courses are carefully selected to provide you with the best free education available online. 
              Start with any course that matches your current skill level and interests.
            </p>
            <div className="flex items-center justify-center gap-8 text-gray-300 flex-wrap">
              <span className="flex items-center gap-3 font-semibold">
                <div className="h-2 w-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50"></div>
                Self-paced learning
              </span>
              <span className="flex items-center gap-3 font-semibold">
                <div className="h-2 w-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></div>
                Industry-relevant skills
              </span>
              <span className="flex items-center gap-3 font-semibold">
                <div className="h-2 w-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50"></div>
                Lifetime access
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
