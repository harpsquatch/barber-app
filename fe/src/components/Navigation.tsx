
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 urban-glass backdrop-blur-urban border-b border-urban-steel/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="font-display text-3xl font-black text-white tracking-wider">
            SELL<span className="text-white">BARBERS</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('booking')}
              className="text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide"
            >
              Booking
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide"
            >
              Contact
            </button>
            <Link 
              to="/login"
              className="text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide border border-urban-neon/30 px-3 py-1 rounded hover:border-urban-neon"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col space-y-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`block w-6 h-0.5 bg-urban-neon transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-urban-neon transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-urban-neon transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-urban-steel/20">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('booking')}
                className="text-left text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide"
              >
                Booking
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide"
              >
                Contact
              </button>
              <Link 
                to="/login"
                className="text-left text-urban-black hover:text-urban-neon transition-colors duration-300 font-urban font-medium uppercase tracking-wide border border-urban-neon/30 px-3 py-1 rounded hover:border-urban-neon inline-block"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
