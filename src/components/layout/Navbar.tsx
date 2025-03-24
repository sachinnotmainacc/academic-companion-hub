
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Calculator, Clock, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Notes", path: "/notes", icon: BookOpen },
    { name: "CGPA Calculator", path: "/cgpa", icon: Calculator },
    { name: "Internal Marks", path: "/internal-marks", icon: Calculator },
    { name: "Pomodoro", path: "/pomodoro", icon: Clock },
  ];
  
  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-dark-950/90 backdrop-blur-lg py-2 shadow-md" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white mr-1">College</span>
              <span className="text-xl font-bold text-blue-500">Daddy</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "text-blue-500 bg-dark-800"
                      : "text-gray-300 hover:text-white hover:bg-dark-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-900/95 backdrop-blur-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-blue-500 bg-dark-800"
                    : "text-gray-300 hover:text-white hover:bg-dark-800"
                )}
              >
                <div className="flex items-center">
                  {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                  {link.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
