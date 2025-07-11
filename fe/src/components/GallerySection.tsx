import React, { useRef, useEffect } from "react";

const images = [
  {
    src: "/lovable-uploads/0ee59d56-cc54-4ec8-b66e-26c73c759b00.png",
    label: "Private rooms"
  },
  {
    src: "/lovable-uploads/243a8d51-95cc-40ed-b77f-87e6cd5d9b8f.png",
    label: "Work ready"
  },
  {
    src: "/lovable-uploads/610e1c13-a8d7-4d8d-b71e-2e740a65abd5.png",
    label: "Beautifully designed"
  }
];

// Duplicate images for seamless looping
const allImages = [...images, ...images];

const SLIDE_DURATION = 3000; // 3 seconds
const IMAGE_WIDTH = 400; // px, adjust to your image/container width

const features = [
  {
    icon: (
      // Scissors icon
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" />
      </svg>
    ),
    title: "Expert Barbers",
    desc: "Our skilled team delivers sharp fades, classic cuts, and the latest styles with precision and care."
  },
  {
    icon: (
      // Chair icon
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="5" y="8" width="14" height="8" rx="2" />
        <path d="M7 16v2a2 2 0 002 2h6a2 2 0 002-2v-2" />
        <path d="M12 8V4" />
      </svg>
    ),
    title: "Relaxing Atmosphere",
    desc: "Enjoy a welcoming, modern space designed for comfort—sit back, relax, and let us take care of you."
  },
  {
    icon: (
      // Razor icon
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="10" width="18" height="4" rx="2" />
        <path d="M7 10V6a2 2 0 012-2h6a2 2 0 012 2v4" />
      </svg>
    ),
    title: "Traditional & Modern Services",
    desc: "From hot towel shaves to beard sculpting and trendy hair designs, we offer a full range of grooming."
  },
  {
    icon: (
      // Calendar icon
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    title: "Easy Online Booking",
    desc: "Book your session in seconds—choose your barber, date, and time, all from your phone or computer."
  },

  {
    icon: (
      // Spray bottle icon
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="8" y="13" width="8" height="7" rx="2" />
        <path d="M12 13V7m0 0a2 2 0 012-2h2a2 2 0 012 2v6" />
      </svg>
    ),
    title: "Premium Products",
    desc: "We use only the best hair and beard products to keep you looking and feeling your best."
  }
];

const GallerySection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let position = 0;
    const totalWidth = IMAGE_WIDTH * images.length;

    const interval = setInterval(() => {
      position += IMAGE_WIDTH;
      if (sliderRef.current) {
        sliderRef.current.style.transition = "transform 0.7s cubic-bezier(.77,0,.18,1)";
        sliderRef.current.style.transform = `translateX(-${position}px)`;
      }
      // Reset to start for seamless loop
      if (position >= totalWidth) {
        setTimeout(() => {
          if (sliderRef.current) {
            sliderRef.current.style.transition = "none";
            sliderRef.current.style.transform = "translateX(0)";
          }
          position = 0;
        }, 700); // match transition duration
      }
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#1D1D1D] py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-y-12 md:gap-x-12 px-4 md:px-8">
        {/* Features/content card */}
        <div className="flex-1 flex flex-col justify-center min-w-[260px]">
          <h2 className="text-4xl md:text-5xl font-[Merriweather] font-bold mb-8 text-white">
            L’arte della <span className="font-[kaushan] text-urban-neon">Barberia</span>
          </h2>
          <ul className="space-y-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-1 text-gray-300">{f.icon}</span>
                <div>
                  <div className="font-semibold text-lg text-white">{f.title}</div>
                  <div className="text-gray-400">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Image card */}
        <div className="flex-1 flex justify-center items-center min-w-[320px]">
          <div className="relative w-full max-w-md h-full min-h-[320px] rounded-2xl overflow-hidden shadow-xl bg-[#232323] flex">
            <div
              ref={sliderRef}
              className="flex h-full"
              style={{
                width: `${allImages.length * IMAGE_WIDTH}px`
              }}
            >
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0"
                  style={{ width: IMAGE_WIDTH, height: "100%" }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {img.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
