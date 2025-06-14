
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Users, Star, BookOpen, Zap, Trophy, Code } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const courses = [
  {
    title: "Complete Web Development Bootcamp",
    provider: "The Odin Project",
    duration: "6-9 months",
    level: "Beginner",
    rating: 4.8,
    students: "50k+",
    description: "Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, and Node.js",
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js", "Databases"],
    link: "https://www.theodinproject.com/",
    price: "Free",
    icon: <Code className="h-6 w-6 text-blue-400" />,
    gradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
  },
  {
    title: "CS50: Introduction to Computer Science",
    provider: "Harvard University",
    duration: "10-20 hours/week",
    level: "Beginner",
    rating: 4.9,
    students: "100k+",
    description: "Harvard's introduction to computer science and programming, covering algorithms, data structures, and more",
    topics: ["C", "Python", "SQL", "JavaScript", "Algorithms", "Data Structures"],
    link: "https://cs50.harvard.edu/x/",
    price: "Free",
    icon: <Trophy className="h-6 w-6 text-yellow-400" />,
    gradient: "from-yellow-600/20 to-orange-600/20",
    borderColor: "border-yellow-500/30",
  },
  {
    title: "freeCodeCamp",
    provider: "freeCodeCamp",
    duration: "300+ hours",
    level: "All Levels",
    rating: 4.7,
    students: "400k+",
    description: "Comprehensive curriculum covering web development, data science, and machine learning",
    topics: ["Web Development", "Data Science", "APIs", "Microservices", "Machine Learning"],
    link: "https://www.freecodecamp.org/",
    price: "Free",
    icon: <Zap className="h-6 w-6 text-green-400" />,
    gradient: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
  },
  {
    title: "JavaScript30",
    provider: "Wes Bos",
    duration: "30 days",
    level: "Intermediate",
    rating: 4.8,
    students: "200k+",
    description: "Build 30 things in 30 days with vanilla JavaScript. No frameworks, libraries, or compilers",
    topics: ["Vanilla JavaScript", "DOM Manipulation", "CSS", "APIs", "Local Storage"],
    link: "https://javascript30.com/",
    price: "Free",
    icon: <BookOpen className="h-6 w-6 text-purple-400" />,
    gradient: "from-purple-600/20 to-violet-600/20",
    borderColor: "border-purple-500/30",
  },
  {
    title: "Coursera Computer Science Courses",
    provider: "Various Universities",
    duration: "4-12 weeks",
    level: "All Levels",
    rating: 4.6,
    students: "1M+",
    description: "University-level computer science courses from top institutions worldwide",
    topics: ["Algorithms", "Machine Learning", "Data Science", "Software Engineering"],
    link: "https://www.coursera.org/browse/computer-science",
    price: "Free/Paid",
    icon: <Star className="h-6 w-6 text-indigo-400" />,
    gradient: "from-indigo-600/20 to-blue-600/20",
    borderColor: "border-indigo-500/30",
  },
  {
    title: "MIT OpenCourseWare",
    provider: "Massachusetts Institute of Technology",
    duration: "Self-paced",
    level: "Advanced",
    rating: 4.9,
    students: "Unlimited",
    description: "Free access to MIT's course materials including lectures, assignments, and exams",
    topics: ["Computer Science", "Mathematics", "Engineering", "Economics"],
    link: "https://ocw.mit.edu/",
    price: "Free",
    icon: <Trophy className="h-6 w-6 text-red-400" />,
    gradient: "from-red-600/20 to-pink-600/20",
    borderColor: "border-red-500/30",
  }
];

const levelColors = {
  Beginner: "bg-green-500/20 text-green-300 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-300 border-red-500/30",
  "All Levels": "bg-blue-500/20 text-blue-300 border-blue-500/30"
};

const Courses = () => {
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
            programming and computer science knowledge.
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

      {/* Courses Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <Card 
                key={index} 
                className={`group bg-gray-900/60 border border-gray-800/50 hover:border-gray-600/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-xl rounded-2xl overflow-hidden h-full flex flex-col`}
                style={{
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
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
                    
                    <p className="text-gray-300 text-sm leading-relaxed font-medium">
                      {course.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 px-6 flex-grow">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">What you'll learn:</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.topics.map((topic, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="text-xs text-gray-300 border-gray-700/60 bg-gray-800/40 hover:bg-gray-800/60 transition-colors"
                            >
                              {topic}
                            </Badge>
                          ))}
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
          
          {/* Call to Action */}
          <div className="mt-20 text-center p-10 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800/60 backdrop-blur-xl shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to start your learning journey?
            </h3>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto font-medium leading-relaxed text-lg">
              These courses are carefully selected to provide you with the best free education available online. 
              Start with any course that matches your current skill level.
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
