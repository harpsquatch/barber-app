
import { Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-urban-black text-urban-white py-12 border-t border-urban-steel/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-display text-3xl font-black mb-4 text-white tracking-wider">
                SELL<span className="text-white">BARBERS</span>
              </h3>
              <p className="text-urban-silver leading-relaxed font-urban">
                Freshest Cuts in the City. Dove la street culture incontra la tecnica professionale per creare look unici e distintivi.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-lg mb-4 text-urban-white uppercase tracking-wide">Quick Links</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="block text-urban-silver hover:text-urban-neon transition-colors duration-300 font-urban uppercase tracking-wide"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('booking')}
                  className="block text-urban-silver hover:text-urban-neon transition-colors duration-300 font-urban uppercase tracking-wide"
                >
                  Booking
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block text-urban-silver hover:text-urban-neon transition-colors duration-300 font-urban uppercase tracking-wide"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block text-urban-silver hover:text-urban-neon transition-colors duration-300 font-urban uppercase tracking-wide"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-display font-bold text-lg mb-4 text-urban-white uppercase tracking-wide">Contact Info</h4>
              <div className="space-y-2 text-urban-silver font-urban">
                <p>Via Urban Style 123</p>
                <p>Milano, MI 20121</p>
                <p className="text-urban-neon font-medium">+39 02 123 4567</p>
                <p className="text-urban-electric font-medium">info@sellbarbers.it</p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-urban-steel/30 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-urban-silver text-sm mb-4 md:mb-0 font-urban">
              © 2024 SELLBARBERS. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-urban-silver hover:text-urban-neon transition-colors duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-urban-silver hover:text-urban-electric transition-colors duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-urban-silver hover:text-urban-orange transition-colors duration-300 transform hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
