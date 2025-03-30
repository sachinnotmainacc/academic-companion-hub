
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Layers, BookOpen, Code, Globe, Brush, Database, Server, PenTool, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  link: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  icon: React.ElementType;
  tags: string[];
}

const coursesData: Course[] = [
  {
    id: "web-dev",
    title: "Web Development Fundamentals",
    category: "Web Development",
    description: "Learn the foundations of modern web development including HTML, CSS, and JavaScript. This course covers responsive design, DOM manipulation, and building interactive websites.",
    link: "https://www.freecodecamp.org/learn/responsive-web-design/",
    difficulty: "Beginner",
    duration: "8 weeks",
    icon: Globe,
    tags: ["HTML", "CSS", "JavaScript"]
  },
  {
    id: "react",
    title: "React.js - Frontend Framework",
    category: "Web Development",
    description: "Master React.js and build dynamic single-page applications. Learn about components, props, state, hooks, and context API for modern frontend development.",
    link: "https://react.dev/learn",
    difficulty: "Intermediate",
    duration: "10 weeks",
    icon: Code,
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: "python",
    title: "Python Programming",
    category: "Programming Languages",
    description: "Comprehensive Python programming course covering basic to advanced concepts including data structures, algorithms, file handling, and object-oriented programming.",
    link: "https://www.learnpython.org/",
    difficulty: "Beginner",
    duration: "12 weeks",
    icon: Code,
    tags: ["Python", "Programming", "OOP"]
  },
  {
    id: "data-science",
    title: "Data Science Essentials",
    category: "Data Science",
    description: "Introduction to data science using Python. Learn data analysis, visualization techniques, statistics, and machine learning fundamentals.",
    link: "https://www.datacamp.com/tracks/data-scientist-with-python",
    difficulty: "Intermediate",
    duration: "16 weeks",
    icon: Database,
    tags: ["Python", "Data Analysis", "Machine Learning"]
  },
  {
    id: "ui-design",
    title: "UI/UX Design Principles",
    category: "Design",
    description: "Learn the principles of effective user interface and user experience design. This course covers design thinking, wireframing, prototyping, and user testing.",
    link: "https://www.coursera.org/specializations/ui-ux-design",
    difficulty: "Beginner",
    duration: "8 weeks",
    icon: Brush,
    tags: ["UI", "UX", "Design", "Figma"]
  },
  {
    id: "node-js",
    title: "Node.js Backend Development",
    category: "Backend Development",
    description: "Build scalable server-side applications with Node.js. Learn Express.js, REST APIs, authentication, database integration, and deployment.",
    link: "https://nodejs.dev/learn",
    difficulty: "Intermediate",
    duration: "10 weeks",
    icon: Server,
    tags: ["Node.js", "Express", "Backend", "API"]
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development with React Native",
    category: "Mobile Development",
    description: "Build cross-platform mobile applications using React Native. Learn component styling, navigation, state management, and API integration.",
    link: "https://reactnative.dev/docs/getting-started",
    difficulty: "Intermediate",
    duration: "12 weeks",
    icon: PenTool,
    tags: ["React Native", "Mobile", "JavaScript"]
  },
  {
    id: "machine-learning",
    title: "Machine Learning Fundamentals",
    category: "Artificial Intelligence",
    description: "Introduction to machine learning algorithms and techniques. Learn supervised and unsupervised learning, neural networks, and model evaluation.",
    link: "https://www.coursera.org/learn/machine-learning",
    difficulty: "Advanced",
    duration: "14 weeks",
    icon: Lightbulb,
    tags: ["Machine Learning", "AI", "Python", "TensorFlow"]
  },
  {
    id: "blockchain",
    title: "Blockchain Development",
    category: "Blockchain",
    description: "Learn blockchain fundamentals and smart contract development. This course covers Ethereum, Solidity, Web3.js, and dApp development.",
    link: "https://cryptozombies.io/",
    difficulty: "Advanced",
    duration: "10 weeks",
    icon: Database,
    tags: ["Blockchain", "Ethereum", "Solidity", "Web3"]
  }
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = Array.from(new Set(coursesData.map(course => course.category)));

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackClick = () => {
    setSelectedCourse(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">
          Online Learning Courses
        </h1>
        <p className="text-gray-400 mb-8">
          Discover high-quality courses to enhance your skills and advance your career
        </p>

        {selectedCourse ? (
          <div className="animate-fade-in">
            <button 
              onClick={handleBackClick}
              className="mb-4 flex items-center text-blue-500 hover:text-blue-400 transition-colors"
            >
              ← Back to all courses
            </button>
            
            <div className="glass-card p-8 rounded-xl shadow-xl">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <selectedCourse.icon className="h-8 w-8 text-blue-500" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedCourse.title}</h2>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant={getDifficultyColor(selectedCourse.difficulty) as any}>
                          {selectedCourse.difficulty}
                        </Badge>
                        <Badge variant="secondary">{selectedCourse.duration}</Badge>
                        <Badge variant="outline">{selectedCourse.category}</Badge>
                      </div>
                    </div>
                    
                    <a 
                      href={selectedCourse.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2 w-fit"
                    >
                      <BookOpen className="h-4 w-4" />
                      Enroll Now
                    </a>
                  </div>
                  
                  <div className="bg-dark-900/50 rounded-lg p-5 mb-6">
                    <h3 className="text-lg font-semibold mb-2">Course Description</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedCourse.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Topics Covered</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCourse.tags.map(tag => (
                        <Badge key={tag} variant="info" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses by name, description or tag..."
                  className="pl-10 bg-dark-900 border-dark-800 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <button
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === null
                      ? "bg-blue-600 text-white"
                      : "bg-dark-800 text-gray-300 hover:bg-dark-700"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-dark-800 text-gray-300 hover:bg-dark-700"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-[0_0_20px_rgba(0,157,255,0.15)] transition-all duration-300 bg-dark-900/80 border border-dark-800 hover:border-blue-500/20 cursor-pointer overflow-hidden"
                    onClick={() => handleCourseClick(course)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <course.icon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg text-white mb-1">{course.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant={getDifficultyColor(course.difficulty) as any} className="text-xs">
                              {course.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">{course.duration}</Badge>
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {course.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {course.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                            {course.tags.length > 3 && (
                              <span className="text-xs text-gray-400">+{course.tags.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <Layers className="h-16 w-16 text-gray-600 mb-4" />
                  <h3 className="text-xl text-gray-400 mb-2">No courses found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
