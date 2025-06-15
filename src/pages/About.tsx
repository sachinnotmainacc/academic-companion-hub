
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GraduationCap, Target, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-blue-500">College Daddy</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Your ultimate companion for academic success and career growth. We're here to make your college journey smoother and more productive.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              To empower students with the tools, resources, and guidance they need to excel in their academic pursuits and prepare for successful careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Academic Excellence</h3>
              <p className="text-gray-400">Supporting students in achieving their academic goals with comprehensive tools and resources.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Preparation</h3>
              <p className="text-gray-400">Helping students prepare for their dream careers with placement preparation and skill development.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-400">Building a supportive community where students can share knowledge and help each other succeed.</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-400">Continuously evolving our platform with cutting-edge tools and features for modern students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              College Daddy was born from the vision of making every student's academic journey more manageable and successful. 
              We understand the challenges that students face - from managing coursework and tracking grades to preparing for placements and staying productive.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Our platform brings together essential tools like note repositories, CGPA calculators, Pomodoro timers, and placement preparation resources 
              all in one place. We believe that by providing students with the right tools and resources, we can help them achieve their full potential.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Today, College Daddy serves thousands of students worldwide, helping them stay organized, motivated, and prepared for their futures. 
              We're committed to continuously improving our platform and adding new features based on student feedback and evolving needs.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-dark-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-500">Student-Centric</h3>
              <p className="text-gray-400">Everything we do is designed with students in mind. Your success is our success.</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-green-500">Quality & Reliability</h3>
              <p className="text-gray-400">We're committed to providing high-quality, reliable tools that you can depend on.</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-500">Accessibility</h3>
              <p className="text-gray-400">Our platform is designed to be accessible to all students, regardless of their background.</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-500">Continuous Improvement</h3>
              <p className="text-gray-400">We constantly evolve based on user feedback and changing educational needs.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
