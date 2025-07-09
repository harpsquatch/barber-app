
import { Instagram, Facebook, Youtube } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-salon-beige">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-salon-black mb-6">
              Mettiti in Contatto
            </h2>
            <p className="text-lg text-salon-black/80 max-w-2xl mx-auto">
              Pronto per prenotare il tuo appuntamento o hai domande? Ci piacerebbe sentirti.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-salon-white rounded-2xl p-8 shadow-lg">
                <h3 className="font-playfair text-2xl font-bold text-salon-black mb-6">Informazioni di Contatto</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-salon-black mb-2">Indirizzo</h4>
                    <p className="text-salon-black/80">
                      Via Giovanni Ricordi, 30<br />
                      20131 Milano MI
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-salon-black mb-2">Telefono</h4>
                    <p className="text-salon-black/80">+39 02 123 4567</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-salon-black mb-2">Email</h4>
                    <p className="text-salon-black/80">ciao@sellbarbers.it</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-salon-black mb-2">Orari</h4>
                    <div className="text-salon-black/80 space-y-1">
                      <p>Lunedì - Venerdì: 9:00 - 19:00</p>
                      <p>Sabato: 8:00 - 18:00</p>
                      <p>Domenica: 10:00 - 17:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-salon-white rounded-2xl p-8 shadow-lg">
                <h3 className="font-playfair text-2xl font-bold text-salon-black mb-6">Seguici</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-salon-beige hover:bg-salon-gold transition-colors duration-300 p-3 rounded-full group"
                    aria-label="Seguici su Instagram"
                  >
                    <Instagram className="w-6 h-6 text-salon-black group-hover:text-salon-white" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-salon-beige hover:bg-salon-gold transition-colors duration-300 p-3 rounded-full group"
                    aria-label="Seguici su Facebook"
                  >
                    <Facebook className="w-6 h-6 text-salon-black group-hover:text-salon-white" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-salon-beige hover:bg-salon-gold transition-colors duration-300 p-3 rounded-full group"
                    aria-label="Iscriviti al nostro canale YouTube"
                  >
                    <Youtube className="w-6 h-6 text-salon-black group-hover:text-salon-white" />
                  </a>
                </div>
                <p className="text-salon-black/60 mt-4 text-sm">
                  Rimani aggiornato sui nostri ultimi stili, consigli e novità del salone!
                </p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="bg-salon-white rounded-2xl p-8 shadow-lg">
              <h3 className="font-playfair text-2xl font-bold text-salon-black mb-6">Trovaci</h3>
              <div className="w-full h-80 bg-salon-beige rounded-xl flex items-center justify-center">
                <div className="text-center text-salon-black/60">
                  <p className="mb-2">Integrazione Google Maps</p>
                  <p className="text-sm">Via Giovanni Ricordi, 30, 20131 Milano MI</p>
                </div>
              </div>
              <p className="text-salon-black/60 mt-4 text-sm">
                Situato nel cuore di Milano, con parcheggio comodo disponibile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
