
import { useState } from 'react';
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
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-8 pr-14">
      <div className="w-full max-w-[815px] h-11 relative mx-1 ">
        {/* Glassy background */}
        <div className="w-full h-11 absolute bg-white/20 rounded-3xl backdrop-blur-xl " />
        {/* Flex container for logo and links group */}
        <div className="relative h-11 flex items-center justify-between z-10 pl-4 pr-4">
          {/* Logo */}
          <div className="font-title text-lg font-bold text-orange-200">
            SELLBARBERS
          </div>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            <button className="px-3 py-1 text-zinc-800 text-[15px] font-semibold font-title leading-[9.28px]" onClick={() => scrollToSection('home')}>Home</button>
            <button className="px-3 py-1 text-zinc-800 text-[15px] font-semibold font-title leading-[9.28px]" onClick={() => scrollToSection('booking')}>Booking</button>
            <button className="px-3 py-1 text-zinc-800 text-[15px] font-semibold font-title leading-[9.28px]" onClick={() => scrollToSection('about')}>About</button>
            <button className="px-3 py-1 text-zinc-800 text-[15px] font-semibold font-title leading-[9.28px]" onClick={() => scrollToSection('contact')}>Contact</button>
            <Link to="/login" className="w-30 h-7 relative bg-zinc-800 rounded-[58px] shadow-md flex items-center justify-center ml-1">
              <span className="text-white text-[15px] font-semibold font-title leading-[9.28px] px-3">Login</span>
            </Link>
          </div>
          {/* Hamburger menu button for mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute top-12 left-0 w-full bg-white/90 rounded-b-3xl shadow-lg z-20 flex flex-col items-center py-4 gap-2">
            <button className="w-full text-zinc-800 text-[15px] font-semibold font-title py-2" onClick={() => scrollToSection('home')}>Home</button>
            <button className="w-full text-zinc-800 text-[15px] font-semibold font-title py-2" onClick={() => scrollToSection('booking')}>Booking</button>
            <button className="w-full text-zinc-800 text-[15px] font-semibold font-title py-2" onClick={() => scrollToSection('about')}>About</button>
            <button className="w-full text-zinc-800 text-[15px] font-semibold font-title py-2" onClick={() => scrollToSection('contact')}>Contact</button>
            <Link to="/login" className="w-full flex justify-center">
              <span className="bg-zinc-800 rounded-[58px] shadow-md text-white text-[15px] font-semibold font-title px-6 py-2">Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
