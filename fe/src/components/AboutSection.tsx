import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-salon-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Media Sections Grid - Horizontal Layout */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Section 1 - First Barbershop Photo */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src="/lovable-uploads/2b1d898c-af61-43f5-86d4-56738081e1be.png"
                    alt="Taglio di precisione - Vista posteriore"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 2 - Second Barbershop Photo */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src="/lovable-uploads/3a225dd3-1850-4188-9a73-af6246e8e6b9.png"
                    alt="Servizio di rasatura professionale"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 3 - Third Barbershop Photo */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src="/lovable-uploads/da0000bd-4fc1-4621-bb26-f6fb4331620c.png"
                    alt="Taglio moderno maschile - Profilo"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-salon-black mb-4">
              Incontra il Nostro Team di Talento
            </h3>
            <p className="text-lg text-salon-black/80 max-w-3xl mx-auto">
              Ogni parrucchiere porta il proprio tocco unico e la propria esperienza, assicurandosi che tu esca dal salone sentendoti sicuro e radioso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Selim",
                role: "Fondatore e Parrucchiere Master",
                specialty: "Specialista Colore e Tagli di Precisione",
                image: "/lovable-uploads/65104e80-9053-4589-985a-d1d549104899.png"
              },
              {
                name: "Daniel",
                role: "Parrucchiere Senior",
                specialty: "Tagli Moderni e Acconciature",
                image: "/lovable-uploads/2d8c60e3-a46c-4bd3-b950-120cd63e3020.png"
              }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-salon-gold/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="font-playfair text-xl font-bold text-salon-black mb-2">{member.name}</h4>
                <p className="text-salon-gold font-medium mb-2">{member.role}</p>
                <p className="text-salon-black/70">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
