
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Calculator, Clock, Map, Code, BookMarked, Mail, Keyboard, FolderOpen } from "lucide-react";
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
    { name: "Pomodoro", path: "/pomodoro", icon: Clock },
    { name: "Placement DSA", path: "/placement-dsa", icon: Code },
    { name: "Projects", path: "/projects", icon: FolderOpen },
    { name: "Typing", path: "/typing", icon: Keyboard },
    { name: "Courses", path: "/courses", icon: BookMarked },
    { name: "Email Perks", path: "/email-perks", icon: Mail },
    { name: "Roadmaps", path: "/roadmaps", icon: Map },
  ];
  
  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-dark-950/90 backdrop-blur-lg py-2 shadow-md" : "bg-transparent py-2 sm:py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-lg sm:text-xl font-bold text-white mr-1">College</span>
              <span className="text-lg sm:text-xl font-bold text-blue-500">Daddy</span>
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-2 xl:space-x-4">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors whitespace-nowrap",
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
          
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white h-10 w-10"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-dark-900/95 backdrop-blur-lg animate-fade-in border-t border-gray-800/50">
          <div className="px-3 pt-2 pb-3 space-y-1 max-h-screen overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "block px-3 py-3 rounded-lg text-base font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-blue-500 bg-dark-800"
                    : "text-gray-300 hover:text-white hover:bg-dark-800"
                )}
              >
                <div className="flex items-center">
                  {link.icon && <link.icon className="mr-3 h-5 w-5" />}
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
