
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FAQ from "@/components/home/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
