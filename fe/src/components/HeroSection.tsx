
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/7970aa1a-db9a-4e14-a8c7-f23315561b1f.png"
          alt="Barbershop interior"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* Button sovrapposto al centro e più basso, allineato verticalmente con il booking */}
      <div className="relative z-10 absolute bottom-16 left-8 animate-fade-in">        
        <Button 
          onClick={scrollToBooking}
          size="lg"
          className="relative bg-gradient-to-r from-cyan-400/20 via-blue-400/30 to-cyan-300/20 backdrop-blur-md border-2 border-cyan-300/50 text-cyan-100 font-bold px-12 py-6 text-lg transition-all duration-300 hover:scale-105 rounded-none uppercase tracking-wider shadow-2xl hover:shadow-cyan-400/30 hover:border-cyan-300/70 hover:bg-gradient-to-r hover:from-cyan-400/30 hover:via-blue-400/40 hover:to-cyan-300/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          style={{
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          PRENOTA ORA
        </Button>
      </div>
      
      {/* Urban scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-urban-electric animate-bounce">
        <div className="w-6 h-10 border-2 border-urban-electric rounded-sm flex justify-center">
          <div className="w-1 h-3 bg-urban-electric rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
