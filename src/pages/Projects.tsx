
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  ExternalLink,
  Github,
  Youtube,
  Filter,
  Search,
  Globe,
  Database,
  Smartphone,
  Cloud,
  Shield,
  Settings,
  Zap,
  Blocks,
  Brain,
  Eye
} from 'lucide-react';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'web', name: 'Web Development', icon: Globe, color: 'bg-blue-500' },
    { id: 'data', name: 'Data Science & ML', icon: Database, color: 'bg-green-500' },
    { id: 'mobile', name: 'Mobile Development', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'cloud', name: 'Cloud Computing', icon: Cloud, color: 'bg-cyan-500' },
    { id: 'security', name: 'Cybersecurity', icon: Shield, color: 'bg-red-500' },
    { id: 'devops', name: 'DevOps', icon: Settings, color: 'bg-orange-500' },
    { id: 'iot', name: 'Internet of Things', icon: Zap, color: 'bg-yellow-500' },
    { id: 'blockchain', name: 'Blockchain', icon: Blocks, color: 'bg-indigo-500' },
    { id: 'ai', name: 'Artificial Intelligence', icon: Brain, color: 'bg-pink-500' },
    { id: 'ar-vr', name: 'AR/VR', icon: Eye, color: 'bg-emerald-500' }
  ];

  const projects = [
    // Web Development
    {
      category: 'web',
      title: 'Personal Portfolio Website',
      description: 'Create a personal portfolio website to showcase your skills, projects, and resume. This project involves using HTML, CSS, JavaScript, and frameworks like React or Angular.',
      github: 'https://github.com/rahuldkjain/portfolio',
      youtube: 'https://www.youtube.com/watch?v=jN_2LO2kivI',
      difficulty: 'Beginner',
      tags: ['HTML', 'CSS', 'JavaScript', 'React']
    },
    {
      category: 'web',
      title: 'E-commerce Platform',
      description: 'Develop a full-stack e-commerce website with features like user authentication, product listings, shopping cart, payment integration, and admin management.',
      github: 'https://github.com/basir/node-react-ecommerce',
      youtube: 'https://www.youtube.com/watch?v=NhbZFWzFJlQ',
      difficulty: 'Advanced',
      tags: ['MERN', 'Node.js', 'React', 'MongoDB']
    },
    // Data Science
    {
      category: 'data',
      title: 'Stock Price Prediction',
      description: 'Use machine learning algorithms to predict future stock prices based on historical data using Python libraries like Pandas, Scikit-learn, and TensorFlow.',
      github: 'https://github.com/huseinzol05/Stock-Prediction-Models',
      youtube: 'https://www.youtube.com/watch?v=QIUxPv5PJOY',
      difficulty: 'Intermediate',
      tags: ['Python', 'TensorFlow', 'Pandas', 'LSTM']
    },
    {
      category: 'data',
      title: 'Customer Segmentation',
      description: 'Develop a model to categorize customers based on purchasing behavior using clustering algorithms and visualize the results.',
      github: 'https://github.com/ageron/handson-ml2/blob/master/12_unsupervised_learning.ipynb',
      youtube: 'https://www.youtube.com/watch?v=U-5oEzi8ncU',
      difficulty: 'Intermediate',
      tags: ['K-means', 'Clustering', 'Python', 'Scikit-learn']
    },
    // Mobile Development
    {
      category: 'mobile',
      title: 'Todo List App',
      description: 'Develop a mobile app for managing tasks using Flutter or React Native. Include features like notifications, cloud synchronization, and a simple user interface.',
      github: 'https://github.com/bizz84/todo_app_flutter',
      youtube: 'https://www.youtube.com/watch?v=KTpM6Pl-w5g',
      difficulty: 'Beginner',
      tags: ['Flutter', 'React Native', 'Mobile', 'Cross-platform']
    },
    {
      category: 'mobile',
      title: 'Health and Fitness Tracker',
      description: 'Build an app to track user fitness data such as steps, calories, and heart rate, integrating APIs like Google Fit or Apple Health.',
      github: 'https://github.com/ivyzhang99/react-native-fitness-tracker',
      youtube: 'https://www.youtube.com/watch?v=e0J7ZCmRYcM',
      difficulty: 'Intermediate',
      tags: ['React Native', 'Health APIs', 'Fitness', 'Mobile']
    },
    // Cloud Computing
    {
      category: 'cloud',
      title: 'Serverless Web Application',
      description: 'Develop a web app using serverless architecture on AWS or Azure, utilizing services like AWS Lambda or Azure Functions.',
      github: 'https://github.com/aws-samples/serverless-web-application',
      youtube: 'https://www.youtube.com/watch?v=wV3fyldY8pI',
      difficulty: 'Advanced',
      tags: ['AWS Lambda', 'Serverless', 'Azure', 'Cloud']
    },
    {
      category: 'cloud',
      title: 'Chatbot Development',
      description: 'Create a cloud-based chatbot using AWS Lex or Azure Bot Services for customer service or FAQ.',
      github: 'https://github.com/aws-samples/aws-lex-web-ui',
      youtube: 'https://www.youtube.com/watch?v=1UMFseF2k8U',
      difficulty: 'Intermediate',
      tags: ['AWS Lex', 'Chatbot', 'NLP', 'Azure Bot']
    },
    // Cybersecurity
    {
      category: 'security',
      title: 'Vulnerability Scanner',
      description: 'Build a tool to scan web applications for common vulnerabilities using Python and libraries like Scapy or Nmap.',
      github: 'https://github.com/Manisso/fsociety',
      youtube: 'https://www.youtube.com/watch?v=z4jWaOnBb2M',
      difficulty: 'Advanced',
      tags: ['Python', 'Security', 'Nmap', 'Vulnerability']
    },
    {
      category: 'security',
      title: 'Password Manager',
      description: 'Develop a secure password manager application that stores user credentials safely using encryption techniques.',
      github: 'https://github.com/mohitkhedkar/password-manager-python',
      youtube: 'https://www.youtube.com/watch?v=6jJ-p_TMCvA',
      difficulty: 'Intermediate',
      tags: ['Encryption', 'Security', 'Python', 'Password']
    },
    // DevOps
    {
      category: 'devops',
      title: 'CI/CD Pipeline Setup',
      description: 'Set up a Continuous Integration/Continuous Deployment pipeline for a project using Jenkins, Docker, and Kubernetes.',
      github: 'https://github.com/jonashackt/jenkins-pipeline-kubernetes',
      youtube: 'https://www.youtube.com/watch?v=Gc18KJx0RCw',
      difficulty: 'Advanced',
      tags: ['Jenkins', 'Docker', 'Kubernetes', 'CI/CD']
    },
    {
      category: 'devops',
      title: 'Infrastructure as Code',
      description: 'Create a project using Terraform or AWS CloudFormation to define and manage cloud resources.',
      github: 'https://github.com/terraform-providers/terraform-provider-aws',
      youtube: 'https://www.youtube.com/watch?v=G-VoF0HICos',
      difficulty: 'Advanced',
      tags: ['Terraform', 'AWS', 'Infrastructure', 'IaC']
    },
    // IoT
    {
      category: 'iot',
      title: 'Smart Home Automation',
      description: 'Build a project to control home appliances using Raspberry Pi or Arduino integrated with AWS IoT.',
      github: 'https://github.com/adafruit/Adafruit_IO_Arduino',
      youtube: 'https://www.youtube.com/watch?v=uoMldgf-9rA',
      difficulty: 'Intermediate',
      tags: ['Raspberry Pi', 'Arduino', 'AWS IoT', 'Home Automation']
    },
    {
      category: 'iot',
      title: 'Environment Monitoring System',
      description: 'Develop an IoT-based system to monitor environmental conditions and visualize data.',
      github: 'https://github.com/edex08/IoT-Environment-Monitoring-System',
      youtube: 'https://www.youtube.com/watch?v=fjqfXP9b4wQ',
      difficulty: 'Intermediate',
      tags: ['IoT', 'Sensors', 'Data Visualization', 'Monitoring']
    },
    // Blockchain
    {
      category: 'blockchain',
      title: 'Cryptocurrency Wallet',
      description: 'Create a basic cryptocurrency wallet for storing, sending, and receiving tokens on a blockchain network.',
      github: 'https://github.com/blockchain/My-Wallet-V3',
      youtube: 'https://www.youtube.com/watch?v=Qxyh6xlo5Zk',
      difficulty: 'Advanced',
      tags: ['Blockchain', 'Cryptocurrency', 'Wallet', 'Web3']
    },
    {
      category: 'blockchain',
      title: 'Decentralized Application (dApp)',
      description: 'Develop a dApp for managing digital assets using blockchain technology.',
      github: 'https://github.com/dappuniversity/starter_kit',
      youtube: 'https://www.youtube.com/watch?v=IPukBiaMJSI',
      difficulty: 'Advanced',
      tags: ['dApp', 'Ethereum', 'Smart Contracts', 'Solidity']
    },
    // AI
    {
      category: 'ai',
      title: 'Chatbot for College Queries',
      description: 'Build an AI chatbot to handle common queries from students using NLP techniques.',
      github: 'https://github.com/abhishek87/college-chatbot',
      youtube: 'https://www.youtube.com/watch?v=NYSKX1QmZ2s',
      difficulty: 'Intermediate',
      tags: ['NLP', 'Chatbot', 'AI', 'Python']
    },
    {
      category: 'ai',
      title: 'Facial Recognition System',
      description: 'Develop a system for facial recognition to enhance security or manage attendance using Python with OpenCV.',
      github: 'https://github.com/shantnu/FaceDetect',
      youtube: 'https://www.youtube.com/watch?v=sz25xxF_AVE',
      difficulty: 'Intermediate',
      tags: ['OpenCV', 'Computer Vision', 'Python', 'Face Recognition']
    },
    // AR/VR
    {
      category: 'ar-vr',
      title: 'AR Educational App',
      description: 'Create an AR app for interactive learning experiences using Unity3D and ARKit or ARCore.',
      github: 'https://github.com/Unity-Technologies/arfoundation-samples',
      youtube: 'https://www.youtube.com/watch?v=Ur9ClzAHBrw',
      difficulty: 'Advanced',
      tags: ['Unity3D', 'ARKit', 'ARCore', 'Education']
    },
    {
      category: 'ar-vr',
      title: 'VR Gaming App',
      description: 'Develop a VR game using Unity3D with Oculus or Google Cardboard.',
      github: 'https://github.com/googlevr/gvr-unity-sdk',
      youtube: 'https://www.youtube.com/watch?v=Ur9ClzAHBrw',
      difficulty: 'Advanced',
      tags: ['Unity3D', 'VR', 'Oculus', 'Gaming']
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-400 border-green-400/20';
      case 'Intermediate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20';
      case 'Advanced':
        return 'bg-red-500/10 text-red-400 border-red-400/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-400/20';
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Code2;
  };

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
                Project Ideas
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-zinc-400 mx-auto mt-4 mb-4"></div>
              <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
                Discover exciting project ideas across different domains to enhance your skills
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Filter className="h-5 w-5" />
                Filter by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <Button
                  onClick={() => setSelectedCategory('all')}
                  className={`h-14 ${selectedCategory === 'all' 
                    ? 'bg-white text-black hover:bg-zinc-200' 
                    : 'bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700/80'
                  } rounded-xl transition-all duration-300`}
                >
                  All Categories
                </Button>
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`h-14 flex flex-col gap-1 ${selectedCategory === category.id
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700/80'
                      } rounded-xl transition-all duration-300`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredProjects.map((project, index) => {
            const CategoryIcon = getCategoryIcon(project.category);
            return (
              <Card key={index} className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 backdrop-blur-xl hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                        <CategoryIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                        <Badge className={`${getDifficultyColor(project.difficulty)} border text-xs font-medium mt-1`}>
                          {project.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-zinc-300 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="border-zinc-600 text-zinc-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button asChild size="sm" className="bg-white text-black hover:bg-zinc-200 transition-all duration-300 flex-1">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:text-white hover:bg-zinc-700/80 flex-1">
                      <a href={project.youtube} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-4 w-4 mr-2" />
                        Tutorial
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 inline-block mb-4">
              <Search className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-zinc-400 mb-4">Try adjusting your filters or search terms</p>
            <Button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }} 
              className="bg-white text-black hover:bg-zinc-200"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
