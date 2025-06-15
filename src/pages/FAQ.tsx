
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I organize my notes in the repository?",
      answer: "Our Notes Repository allows you to organize notes by semester and subject. You can upload, categorize, and search for notes easily, making it simple to find what you need when studying for exams."
    },
    {
      question: "How accurate is the CGPA calculator?",
      answer: "The CGPA calculator uses standard academic formulas to provide accurate calculations. It takes into account your course credits and grades to give you a precise cumulative GPA. You can also use it to predict future performance."
    },
    {
      question: "Can I track my attendance with College Daddy?",
      answer: "Yes! The Internal Assessment Calculator includes an attendance tracking feature. It helps you monitor your current attendance percentage and shows how many classes you can miss while still meeting the minimum attendance requirement."
    },
    {
      question: "How does the Pomodoro Timer work?",
      answer: "The Pomodoro Timer follows the popular productivity technique with 25-minute focused work sessions followed by 5-minute breaks. After completing 4 sessions, you get a longer 15-minute break. You can customize these intervals based on your preferences."
    },
    {
      question: "Are the Roadmaps customizable?",
      answer: "Yes, our Roadmaps are designed to be flexible. While we provide curated learning paths for various subjects and tech fields, you can customize them according to your learning goals and pace."
    },
    {
      question: "Is my data secure and private?",
      answer: "We take data privacy seriously. All your academic data is stored securely and is only accessible to you. We don't share your information with third parties, and you can delete your data at any time."
    },
    {
      question: "How do I access the Placement DSA questions?",
      answer: "The Placement DSA section contains thousands of curated questions from top companies. You can filter by difficulty, topic, or company. All questions are freely accessible and include popularity and acceptance rate statistics."
    },
    {
      question: "Can I use College Daddy offline?",
      answer: "Some features like the Pomodoro Timer and CGPA Calculator work offline once loaded. However, features that require data synchronization like Notes Repository and Placement DSA questions need an internet connection."
    },
    {
      question: "Is College Daddy free to use?",
      answer: "Yes! College Daddy is completely free to use. All our core features including notes management, calculators, timers, and DSA questions are available at no cost."
    },
    {
      question: "How often is the content updated?",
      answer: "We regularly update our question database, add new courses, and improve existing features. Major updates are released monthly, while bug fixes and minor improvements are deployed weekly."
    },
    {
      question: "Can I contribute to the platform?",
      answer: "Absolutely! We welcome contributions from the community. You can submit questions, share notes, report bugs, or suggest new features. Contact us through our support channels to get involved."
    },
    {
      question: "What browsers are supported?",
      answer: "College Daddy works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Find answers to the most common questions about College Daddy and how to make the most of our platform.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-dark-900 border border-dark-800 rounded-lg px-6"
              >
                <AccordionTrigger className="text-white hover:text-blue-400 text-left py-6 text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Can't find the answer you're looking for? Feel free to reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@collegedaddy.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
