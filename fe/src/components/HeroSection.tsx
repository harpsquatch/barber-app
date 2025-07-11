
import { Button } from '@/components/ui/button';
import BookingForm from './BookingForm';

const HeroSection = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <section id="home" className="relative h-screen bg-cover">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/hero.png"
            alt="Barbershop interior"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Main content container (centered, max width) */}
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-y-12 md:gap-x-12 px-4 md:px-8 h-full">
          {/* Left group: hero content */}
          <div className="flex-1 flex flex-col justify-center items-start min-w-[260px]">
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
                </button>
                {/* Outlined Button */}
                <button className="w-28 h-8 relative rounded-md outline outline-1 outline-offset-[-1px] outline-orange-200 flex items-center justify-center overflow-hidden">
                  <span className="text-orange-200 text-xs font-normal font-[Poppins]">Prenota Ora</span>
                </button>
              </div>
            </div>
          </div>
          {/* Right group: Booking Form */}
          <div className="flex-1 flex justify-center items-center min-w-[320px]">
            <div className="max-w-lg w-full">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
      {/* Gradient bar, positioned to bleed out of the bottom */}
      <div
        className="absolute left-0 bottom-0 w-full bg-gradient-to-b from-transparent via-[#1D1D1D]/80 to-[#1D1D1D] pointer-events-none"
        style={{ height: "190px" }}
      />
    </div>
    
  );
};

export default HeroSection;
