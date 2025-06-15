
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Code, Filter, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Category = "all" | "web" | "mobile" | "fullstack" | "ai" | "blockchain";

const categories = [
  { id: "all" as Category, label: "All Projects" },
  { id: "web" as Category, label: "Web Apps" },
  { id: "mobile" as Category, label: "Mobile Apps" },
  { id: "fullstack" as Category, label: "Full Stack" },
  { id: "ai" as Category, label: "AI/ML" },
  { id: "blockchain" as Category, label: "Blockchain" }
];

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with React, Node.js, and MongoDB featuring user authentication, payment integration, and admin dashboard.",
    category: "fullstack" as Category,
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT"],
    githubUrl: "https://github.com/example/ecommerce",
    liveUrl: "https://ecommerce-demo.com",
    stars: 245,
    featured: true
  },
  {
    title: "Mobile Task Manager",
    description: "A native mobile application for managing tasks and projects, built with React Native and Firebase.",
    category: "mobile" as Category,
    technologies: ["React Native", "Firebase", "Redux", "UI Kitten"],
    githubUrl: "https://github.com/example/taskmanager",
    liveUrl: "https://play.google.com/store/apps/details?id=com.taskmanager",
    stars: 189,
    featured: false
  },
  {
    title: "AI-Powered Chatbot",
    description: "An intelligent chatbot using natural language processing and machine learning to provide customer support.",
    category: "ai" as Category,
    technologies: ["Python", "TensorFlow", "NLP", "Flask"],
    githubUrl: "https://github.com/example/chatbot",
    liveUrl: null,
    stars: 322,
    featured: true
  },
  {
    title: "Decentralized Voting System",
    description: "A secure and transparent voting system using blockchain technology to ensure fair elections.",
    category: "blockchain" as Category,
    technologies: ["Solidity", "Ethereum", "Web3.js", "Truffle"],
    githubUrl: "https://github.com/example/voting",
    liveUrl: null,
    stars: 98,
    featured: false
  },
  {
    title: "Personal Portfolio Website",
    description: "A responsive and modern portfolio website built with Next.js and Tailwind CSS to showcase projects and skills.",
    category: "web" as Category,
    technologies: ["Next.js", "Tailwind CSS", "Vercel"],
    githubUrl: "https://github.com/example/portfolio",
    liveUrl: "https://johndoe.com",
    stars: 412,
    featured: true
  },
  {
    title: "Real-Time Chat Application",
    description: "A web-based chat application with real-time messaging using Socket.IO and React.",
    category: "fullstack" as Category,
    technologies: ["React", "Node.js", "Socket.IO", "Express"],
    githubUrl: "https://github.com/example/chatapp",
    liveUrl: "https://chat-demo.com",
    stars: 155,
    featured: false
  },
  {
    title: "Machine Learning Image Classifier",
    description: "A web application that classifies images using a pre-trained machine learning model.",
    category: "ai" as Category,
    technologies: ["Python", "Flask", "TensorFlow", "HTML/CSS"],
    githubUrl: "https://github.com/example/imageclassifier",
    liveUrl: null,
    stars: 201,
    featured: false
  },
  {
    title: "Blockchain-Based Supply Chain Tracker",
    description: "A decentralized application to track products in a supply chain using blockchain technology.",
    category: "blockchain" as Category,
    technologies: ["Solidity", "Ethereum", "React", "Web3.js"],
    githubUrl: "https://github.com/example/supplychain",
    liveUrl: null,
    stars: 76,
    featured: false
  },
  {
    title: "Responsive Blog Website",
    description: "A blog website built with Gatsby and GraphQL, featuring responsive design and optimized performance.",
    category: "web" as Category,
    technologies: ["Gatsby", "GraphQL", "React", "Netlify"],
    githubUrl: "https://github.com/example/blog",
    liveUrl: "https://blog-demo.com",
    stars: 288,
    featured: false
  },
  {
    title: "Cross-Platform Mobile App",
    description: "A mobile application built with Flutter for both iOS and Android platforms.",
    category: "mobile" as Category,
    technologies: ["Flutter", "Dart", "Firebase"],
    githubUrl: "https://github.com/example/mobileapp",
    liveUrl: null,
    stars: 123,
    featured: false
  }
];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const featuredProjects = projects.filter(project => project.featured);

  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All Projects";
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.label : "All Projects";
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section - Mobile Optimized */}
      <div className="container mx-auto pt-16 sm:pt-20 pb-6 sm:pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 backdrop-blur-sm">
            <Code className="h-3 w-3 sm:h-4 sm:w-4" />
            Open Source Projects
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-2">
            Explore Our
            <br className="sm:hidden" />
            <span className="sm:ml-2 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              Project Portfolio
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Discover innovative projects built with modern technologies. 
            From web applications to mobile apps and AI solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 text-green-400">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-semibold text-white">Open Source</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Github className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-semibold text-white">MIT Licensed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Section - Mobile Optimized */}
      {featuredProjects.length > 0 && (
        <div className="container mx-auto px-4 pb-6 sm:pb-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center sm:text-left px-2">
              ⭐ Featured Projects
            </h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              {featuredProjects.slice(0, 2).map((project, index) => (
                <Card 
                  key={index} 
                  className="group bg-gray-900/60 border border-gray-800/50 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col hover:scale-[1.01] sm:hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-6">
                    <CardHeader className="p-0 mb-3 sm:mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                          {project.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0 ml-2">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm font-semibold">{project.stars}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </CardHeader>

                    <CardContent className="p-0 flex-grow">
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge 
                            key={tech} 
                            variant="secondary" 
                            className="bg-gray-800/60 text-gray-300 border-gray-700/60 text-xs px-2 py-1"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge 
                            variant="outline" 
                            className="border-gray-600/60 text-gray-400 text-xs px-2 py-1"
                          >
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-0 mt-auto">
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 h-8 sm:h-9 text-white font-semibold border-gray-700/60 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-300 text-xs"
                          onClick={() => window.open(project.githubUrl, '_blank')}
                        >
                          <Github className="mr-1 h-3 w-3" />
                          Code
                        </Button>
                        {project.liveUrl && (
                          <Button 
                            size="sm"
                            className="flex-1 h-8 sm:h-9 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all duration-300 text-xs"
                            onClick={() => window.open(project.liveUrl, '_blank')}
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Live
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar - Mobile Optimized */}
      <div className="container mx-auto px-4 pb-4 sm:pb-6">
        <div className="max-w-6xl mx-auto">
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="flex justify-center">
            <CollapsibleTrigger asChild>
              <Button 
                className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 text-white hover:bg-zinc-700/80 justify-between w-full sm:w-auto sm:min-w-[200px] transition-all duration-300 hover:shadow-lg hover:border-zinc-600/50 h-10 sm:h-12 text-sm"
                variant="outline"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate text-xs sm:text-sm">{getSelectedCategoryName()}</span>
                </div>
                <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 flex-shrink-0 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="w-full mt-2 transition-all duration-300 ease-in-out">
              <Card className="bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 border-zinc-700/50 backdrop-blur-xl shadow-2xl animate-fade-in">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setIsFilterOpen(false);
                        }}
                        className={`h-8 sm:h-10 md:h-12 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${selectedCategory === category.id
                          ? 'bg-white text-black hover:bg-zinc-200 shadow-md'
                          : 'bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700/80'
                        } rounded-lg sm:rounded-xl`}
                      >
                        <span className="truncate px-1">{category.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Projects Grid - Mobile Optimized */}
      <div className="container mx-auto px-4 pb-8 sm:pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <Card 
                key={index} 
                className="group bg-gray-900/60 border border-gray-800/50 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col hover:scale-[1.01] sm:hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-6">
                  <CardHeader className="p-0 mb-3 sm:mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                        {project.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0 ml-2">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-semibold">{project.stars}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </CardHeader>

                  <CardContent className="p-0 flex-grow">
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="secondary" 
                          className="bg-gray-800/60 text-gray-300 border-gray-700/60 text-xs px-2 py-1"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="border-gray-600/60 text-gray-400 text-xs px-2 py-1"
                        >
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-0 mt-auto">
                    <div className="flex gap-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 h-8 sm:h-9 text-white font-semibold border-gray-700/60 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-300 text-xs"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                      >
                        <Github className="mr-1 h-3 w-3" />
                        Code
                      </Button>
                      {project.liveUrl && (
                        <Button 
                          size="sm"
                          className="flex-1 h-8 sm:h-9 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all duration-300 text-xs"
                          onClick={() => window.open(project.liveUrl, '_blank')}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Live
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Call to Action - Mobile Optimized */}
          <div className="mt-12 sm:mt-16 md:mt-20 text-center p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800/60 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
              Ready to contribute?
            </h3>
            <p className="text-gray-200 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto font-medium leading-relaxed text-sm sm:text-base md:text-lg">
              Join our open-source community and help us build amazing projects together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-gray-300 flex-wrap">
              <span className="flex items-center gap-2 sm:gap-3 font-semibold text-xs sm:text-sm md:text-base">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-400"></div>
                Open to contributions
              </span>
              <span className="flex items-center gap-2 sm:gap-3 font-semibold text-xs sm:text-sm md:text-base">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-400"></div>
                Active community
              </span>
              <span className="flex items-center gap-2 sm:gap-3 font-semibold text-xs sm:text-sm md:text-base">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-purple-400"></div>
                Learning focused
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Projects;
