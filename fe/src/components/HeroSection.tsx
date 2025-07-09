
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative flex flex-col justify-center items-start overflow-hidden h-screen">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/hero.png"
          alt="Barbershop interior"
          className="w-full h-full object-cover"
        />
        {/* Removed the dark overlay */}
      </div>
      
      {/* Left-aligned hero content with padding */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full pl-8 md:pl-16">
        <div className="w-120 inline-flex flex-col justify-start items-start gap-10">
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
            <div className="w-80 h-34 flex items-center text-orange-200 text-8xl font-bold font-[Merriweather] leading-[90px]">
              BARBER <br />SHOP
            </div>
            <div className="self-stretch h-8 flex items-center">
              <span className="text-white text-6xl font-normal font-[kaushan] leading-tight">walk out with Style </span>
            </div>
          </div>
          <div className="self-stretch h-14 inline-flex justify-start items-center gap-3">
            {/* Orange Button */}
            <button className="w-32 h-8 relative bg-orange-200 rounded-md shadow-md flex items-center justify-center overflow-hidden">
              <span className="text-neutral-800 text-xs font-normal font-[Poppins]">Prenota Ora</span>
              {/* Decorative dots (optional, can be removed or replaced with an icon) */}
            </button>
            {/* Outlined Button */}
            <button className="w-28 h-8 relative rounded-md outline outline-1 outline-offset-[-1px] outline-orange-200 flex items-center justify-center overflow-hidden">
              <span className="text-orange-200 text-xs font-normal font-[Poppins]">Prenota Ora</span>
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
