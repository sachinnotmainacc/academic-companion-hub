
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy <span className="text-blue-500">Policy</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-invert max-w-none">
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Introduction</h2>
              <p className="text-gray-400 leading-relaxed">
                At College Daddy, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Personal Information</h3>
              <ul className="text-gray-400 leading-relaxed mb-6 space-y-2">
                <li>• Email address (when you contact us or subscribe to updates)</li>
                <li>• Academic information (grades, courses, notes you upload)</li>
                <li>• Usage data and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-blue-400">Automatically Collected Information</h3>
              <ul className="text-gray-400 leading-relaxed space-y-2">
                <li>• Browser type and version</li>
                <li>• Operating system</li>
                <li>• IP address</li>
                <li>• Usage patterns and interactions with our platform</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">How We Use Your Information</h2>
              <ul className="text-gray-400 leading-relaxed space-y-2">
                <li>• To provide and maintain our services</li>
                <li>• To improve user experience and platform functionality</li>
                <li>• To communicate with you about updates and new features</li>
                <li>• To analyze usage patterns and optimize performance</li>
                <li>• To ensure platform security and prevent abuse</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Data Storage and Security</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. Your data is stored securely and access is limited to authorized personnel only.
              </p>
              <ul className="text-gray-400 leading-relaxed space-y-2">
                <li>• Data encryption in transit and at rest</li>
                <li>• Regular security audits and updates</li>
                <li>• Limited access controls</li>
                <li>• Secure backup procedures</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Information Sharing</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described below:
              </p>
              <ul className="text-gray-400 leading-relaxed space-y-2">
                <li>• To comply with legal obligations</li>
                <li>• To protect our rights and safety</li>
                <li>• With your explicit consent</li>
                <li>• To trusted service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Cookies and Tracking</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience and analyze site usage. 
                You can control cookie settings through your browser preferences.
              </p>
              <ul className="text-gray-400 leading-relaxed space-y-2">
                <li>• Essential cookies for platform functionality</li>
                <li>• Analytics cookies to understand usage patterns</li>
                <li>• Preference cookies to remember your settings</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Your Rights</h2>
              <p className="text-gray-400 leading-relaxed mb-4">You have the right to:</p>
              <ul className="text-gray-400 leading-relaxed space-y-2">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate data</li>
                <li>• Delete your account and associated data</li>
                <li>• Opt-out of communications</li>
                <li>• Request data portability</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Data Retention</h2>
              <p className="text-gray-400 leading-relaxed">
                We retain your personal information only for as long as necessary to provide our services and fulfill the purposes 
                outlined in this Privacy Policy. When you delete your account, we will remove your personal data within 30 days, 
                except where retention is required by law.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Children's Privacy</h2>
              <p className="text-gray-400 leading-relaxed">
                Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information 
                from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Changes to This Policy</h2>
              <p className="text-gray-400 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Contact Us</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-dark-900 rounded-lg p-6 border border-dark-800">
                <p className="text-gray-400">Email: privacy@collegedaddy.com</p>
                <p className="text-gray-400">Response time: Within 48 hours</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
