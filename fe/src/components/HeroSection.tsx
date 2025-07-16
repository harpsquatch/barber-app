
import { Button } from '@/components/ui/button';
import BookingForm from './BookingForm';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const HeroSection = () => {
  const [shopName, setShopName] = useState('BARBER SHOP');
  const [slogan, setSlogan] = useState('walk out with Style');
  const [address, setAddress] = useState('Via Urban Style 123');
  const [city, setCity] = useState('Milano, MI 20121');
  const [phone, setPhone] = useState('+39 02 123 4567');
  const [isLoading, setIsLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  // Fetch shop name from general_info
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('general_info')
          .select('name, slogan, address, phone')
          .single();

        if (error) {
          console.error('Error fetching shop info:', error);
          return;
        }

        if (data) {
          if (data.name) {
            setShopName(data.name);
          }
          if (data.slogan) {
            setSlogan(data.slogan);
          }
          if (data.address) {
            setAddress(data.address);
          }
          if (data.phone) {
            setPhone(data.phone);
          }
          // For now, we'll keep the default city since it might not be in the database
          // If you want to add a city field to general_info, we can update this
        }
      } catch (error) {
        console.error('Error fetching shop info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopInfo();
  }, []);



  const handlePrenotaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  const handleContattaciClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <section id="home" className="relative min-h-screen h-auto lg:h-screen bg-cover">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/hero.png"
            alt="Barbershop interior"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Main content container (centered, max width) */}
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-y-8 lg:gap-x-12 px-4 md:px-8 min-h-screen lg:h-full pt-24 sm:pt-32 lg:pt-0 py-12 lg:py-0">
          {/* Left group: hero content */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full lg:min-w-[260px] order-1 lg:order-1">
            <div className="w-full lg:w-120 inline-flex flex-col justify-start items-center lg:items-start gap-6 lg:gap-10">
              <div className="self-stretch flex flex-col justify-start items-center lg:items-start gap-2 lg:gap-2.5">
                <div className="w-full lg:w-80 h-auto lg:h-34 flex items-center justify-center lg:justify-start text-orange-200 text-6xl sm:text-6xl lg:text-8xl font-bold font-[Merriweather] leading-tight lg:leading-[90px] text-center lg:text-left">
                  {isLoading ? 'BARBER SHOP' : shopName}
                </div>
                <div className="self-stretch h-auto lg:h-8 flex items-center justify-center lg:justify-start">
                  <span className="text-white text-4xl sm:text-4xl lg:text-6xl font-normal font-[kaushan] leading-tight text-center lg:text-left">{isLoading ? 'walk out with Style' : slogan}</span>
                </div>
              </div>
              <div className="self-stretch h-auto lg:h-14 inline-flex justify-center lg:justify-start items-center gap-2 lg:gap-3 flex-wrap">
                {/* Orange Button */}
                <button 
                  onClick={handlePrenotaClick}
                  className="w-28 sm:w-32 h-8 relative bg-orange-200 rounded-md shadow-md flex items-center justify-center overflow-hidden"
                >
                  <span className="text-neutral-800 text-xs font-normal font-[Poppins]">Prenota Ora ✧
                  </span>
                </button>
                {/* Outlined Button */}
                <button 
                  onClick={handleContattaciClick}
                  className="w-24 sm:w-28 h-8 relative rounded-md outline outline-1 outline-offset-[-1px] outline-orange-200 flex items-center justify-center overflow-hidden"
                >
                  <span className="text-orange-200 text-xs font-normal font-[Poppins]">Contattaci</span>
                </button>
              </div>

            </div>
          </div>
          {/* Right group: Booking Form */}
          <div className="flex-1 flex justify-center items-center w-full lg:min-w-[320px] order-2 lg:order-2 mb-8 lg:mb-0">
            <div className={`w-full max-w-sm sm:max-w-md lg:max-w-lg ${isShaking ? 'animate-shake' : ''}`}>
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
