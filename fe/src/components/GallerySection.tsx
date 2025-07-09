
import React from 'react';

const GallerySection = () => {
  const galleryImages = [
    {
      src: '/lovable-uploads/0ee59d56-cc54-4ec8-b66e-26c73c759b00.png',
      alt: 'Modern barbershop interior with green wall accents'
    },
    {
      src: '/lovable-uploads/243a8d51-95cc-40ed-b77f-87e6cd5d9b8f.png',
      alt: 'Professional barber workstation with modern lighting'
    },
    {
      src: '/lovable-uploads/610e1c13-a8d7-4d8d-b71e-2e740a65abd5.png',
      alt: 'Hair washing station with comfortable seating'
    },
    {
      src: '/lovable-uploads/f96f0d4b-35e6-4d4b-89ba-31356f3fdbeb.png',
      alt: 'Product display and reception area'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-urban-black via-urban-charcoal to-urban-steel">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] hover:scale-105 transform transition-all duration-500"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-urban-neon/50 transition-all duration-300 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Modern decorative elements */}
        <div className="flex justify-center mt-12 space-x-4">
          <div className="w-12 h-0.5 bg-urban-neon animate-pulse" />
          <div className="w-3 h-3 border-2 border-urban-neon rounded-full animate-pulse" />
          <div className="w-12 h-0.5 bg-urban-neon animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
