
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
      answer:
        "Our Notes Repository allows you to organize notes by semester and subject. You can upload, categorize, and search for notes easily, making it simple to find what you need when studying for exams.",
    },
    {
      question: "How accurate is the CGPA calculator?",
      answer:
        "The CGPA calculator uses standard academic formulas to provide accurate calculations. It takes into account your course credits and grades to give you a precise cumulative GPA. You can also use it to predict future performance.",
    },
    {
      question: "Can I track my attendance with College Daddy?",
      answer:
        "Yes! The Internal Assessment Calculator includes an attendance tracking feature. It helps you monitor your current attendance percentage and shows how many classes you can miss while still meeting the minimum attendance requirement.",
    },
    {
      question: "How does the Pomodoro Timer work?",
      answer:
        "The Pomodoro Timer follows the popular productivity technique with 25-minute focused work sessions followed by 5-minute breaks. After completing 4 sessions, you get a longer 15-minute break. You can customize these intervals based on your preferences.",
    },
    {
      question: "Are the Roadmaps customizable?",
      answer:
        "Yes, our Roadmaps are designed to be flexible. While we provide curated learning paths for various subjects and tech fields, you can customize them according to your learning goals and pace.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "We take data privacy seriously. All your academic data is stored securely and is only accessible to you. We don't share your information with third parties, and you can delete your data at any time.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h2>
          <p className="text-gray-400">
            Find answers to the most common questions about College Daddy
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-b border-dark-800 py-2"
            >
              <AccordionTrigger className="text-white hover:text-blue-400 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
