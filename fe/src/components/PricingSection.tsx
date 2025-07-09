
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PricingSection = () => {
  const services = {
    taglio: [
      { name: "Taglio uomo", price: "25€" },
      { name: "Taglio bambino (fino a 12 anni)", price: "20€" },
      { name: "Taglio + barba", price: "35€" },
      { name: "Taglio + shampoo", price: "30€" },
      { name: "Taglio completo (taglio + barba + shampoo)", price: "40€" }
    ],
    barba: [
      { name: "Rifinitura barba", price: "15€" },
      { name: "Barba completa", price: "20€" },
      { name: "Rasatura tradizionale", price: "25€" },
      { name: "Trattamento barba premium", price: "30€" }
    ],
    trattamenti: [
      { name: "Shampoo", price: "8€" },
      { name: "Lavaggio + asciugatura", price: "12€" },
      { name: "Trattamento cuoio capelluto", price: "20€" },
      { name: "Styling", price: "15€" },
      { name: "Maschera idratante", price: "18€" }
    ],
    colorazione: [
      { name: "Ritocco colore", price: "35€" },
      { name: "Colorazione completa", price: "45€" },
      { name: "Colpi di sole", price: "50€" },
      { name: "Decolorazione", price: "40€" }
    ]
  };

  return (
    <section id="pricing" className="py-20 bg-salon-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-salon-black mb-6">
              I Nostri Prezzi
            </h2>
            <p className="text-lg text-salon-black/80 max-w-2xl mx-auto">
              Scopri i nostri servizi di qualità a prezzi competitivi. Ogni trattamento è personalizzato per le tue esigenze.
            </p>
          </div>

          <Tabs defaultValue="taglio" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="taglio">Tagli</TabsTrigger>
              <TabsTrigger value="barba">Barba</TabsTrigger>
              <TabsTrigger value="trattamenti">Trattamenti</TabsTrigger>
              <TabsTrigger value="colorazione">Colorazione</TabsTrigger>
            </TabsList>

            {Object.entries(services).map(([category, serviceList]) => (
              <TabsContent key={category} value={category}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-playfair text-2xl capitalize text-salon-black">
                      {category === 'taglio' && 'Servizi di Taglio'}
                      {category === 'barba' && 'Servizi Barba'}
                      {category === 'trattamenti' && 'Trattamenti Speciali'}
                      {category === 'colorazione' && 'Colorazione'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold text-salon-black">Servizio</TableHead>
                          <TableHead className="text-right font-semibold text-salon-black">Prezzo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceList.map((service, index) => (
                          <TableRow key={index} className="hover:bg-salon-beige/30">
                            <TableCell className="font-medium text-salon-black/90">
                              {service.name}
                            </TableCell>
                            <TableCell className="text-right font-bold text-salon-gold">
                              {service.price}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
