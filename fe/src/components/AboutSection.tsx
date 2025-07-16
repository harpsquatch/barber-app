import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AboutSection = () => {
  const [teamTitle, setTeamTitle] = useState('Il Nostro Team');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamTitle = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('general_info')
          .select('team_title')
          .single();
        if (error) {
          console.error('Error fetching team title:', error);
          return;
        }
        if (data && data.team_title) {
          setTeamTitle(data.team_title);
        }
      } catch (error) {
        console.error('Error fetching team title:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamTitle();
  }, []);

  function renderStyledTitle(title) {
    const words = title.trim().split(' ');
    if (words.length === 1) {
      return <span className="font-[kaushan] text-[#EAB308]">{words[0]}</span>;
    }
    const lastWord = words.pop();
    return <>{words.join(' ')} <span className="font-[kaushan] text-[#EAB308]">{lastWord}</span></>;
  }

  return (
    <section id="about" className="py-20 bg-salon-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Title and Subtext */}
        <div className="mb-8 text-left">
          <h2 className="text-4xl md:text-5xl font-[Merriweather] font-bold mb-8 text-salon-black">
            {isLoading ? renderStyledTitle('Il Nostro Team') : renderStyledTitle(teamTitle)}
          </h2>
          <p className="text-lg text-salon-black/70">
            Conosci i professionisti che rendono unica la tua esperienza nel nostro salone.
          </p>
        </div>
        {/* Media Sections Grid - Horizontal Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* First Barbershop Photo */}
          <div>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full h-full">
              <CardContent className="p-0 w-full h-full">
                <div className="aspect-[4/5] w-full h-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/team1.jpg"
                    alt="Taglio di precisione - Vista posteriore"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 text-left">
              <h3 className="text-xl font-semibold text-salon-black">Selim, Fondatore e Parrucchiere Master</h3>
              <p className="text-salon-black/70">Specialista Colore e Tagli di Precisione</p>
            </div>
          </div>
          {/* Second Barbershop Photo */}
          <div>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full h-full">
              <CardContent className="p-0 w-full h-full">
                <div className="aspect-[4/5] w-full h-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/team2.jpg"
                    alt="Taglio moderno maschile - Profilo"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 text-left">
              <h3 className="text-xl font-semibold text-salon-black">Daniel, Parruchiere Senior</h3>
              <p className="text-salon-black/70">Tagli Moderni e Acconciature</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
