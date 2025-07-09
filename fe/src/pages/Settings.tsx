
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Upload, Plus, Trash2, Save, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface BarberSettings {
  id: string;
  name: string;
  isActive: boolean;
  workingHours: {
    monday: { start: string; end: string; isActive: boolean };
    tuesday: { start: string; end: string; isActive: boolean };
    wednesday: { start: string; end: string; isActive: boolean };
    thursday: { start: string; end: string; isActive: boolean };
    friday: { start: string; end: string; isActive: boolean };
    saturday: { start: string; end: string; isActive: boolean };
    sunday: { start: string; end: string; isActive: boolean };
  };
}

interface ServiceSettings {
  category: string;
  services: Array<{
    name: string;
    price: string;
    description: string;
  }>;
}

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [siteName, setSiteName] = useState('SELLBARBERS');
  const [slogan, setSlogan] = useState('Il tuo barbiere di fiducia');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [instagramLink, setInstagramLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');

  const [barbers, setBarbers] = useState<BarberSettings[]>([
    {
      id: '1',
      name: 'Selim',
      isActive: true,
      workingHours: {
        monday: { start: '09:00', end: '18:00', isActive: true },
        tuesday: { start: '09:00', end: '18:00', isActive: true },
        wednesday: { start: '09:00', end: '18:00', isActive: true },
        thursday: { start: '09:00', end: '18:00', isActive: true },
        friday: { start: '09:00', end: '18:00', isActive: true },
        saturday: { start: '09:00', end: '16:00', isActive: true },
        sunday: { start: '10:00', end: '14:00', isActive: false }
      }
    },
    {
      id: '2',
      name: 'Daniel',
      isActive: true,
      workingHours: {
        monday: { start: '10:00', end: '19:00', isActive: true },
        tuesday: { start: '10:00', end: '19:00', isActive: true },
        wednesday: { start: '10:00', end: '19:00', isActive: true },
        thursday: { start: '10:00', end: '19:00', isActive: true },
        friday: { start: '10:00', end: '19:00', isActive: true },
        saturday: { start: '09:00', end: '17:00', isActive: true },
        sunday: { start: '10:00', end: '14:00', isActive: false }
      }
    }
  ]);

  const [services, setServices] = useState<ServiceSettings[]>([
    {
      category: 'Tagli',
      services: [
        { name: 'Taglio uomo', price: '25€', description: 'Taglio classico o moderno' },
        { name: 'Taglio bambino', price: '20€', description: 'Fino a 12 anni' }
      ]
    },
    {
      category: 'Barba',
      services: [
        { name: 'Rifinitura barba', price: '15€', description: 'Sistemazione e definizione' },
        { name: 'Barba completa', price: '20€', description: 'Taglio e cura completa' }
      ]
    }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/jpeg') {
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Errore",
        description: "Per favore seleziona un file JPG",
        variant: "destructive"
      });
    }
  };

  const addBarber = () => {
    const newBarber: BarberSettings = {
      id: Date.now().toString(),
      name: '',
      isActive: true,
      workingHours: {
        monday: { start: '09:00', end: '18:00', isActive: true },
        tuesday: { start: '09:00', end: '18:00', isActive: true },
        wednesday: { start: '09:00', end: '18:00', isActive: true },
        thursday: { start: '09:00', end: '18:00', isActive: true },
        friday: { start: '09:00', end: '18:00', isActive: true },
        saturday: { start: '09:00', end: '16:00', isActive: true },
        sunday: { start: '10:00', end: '14:00', isActive: false }
      }
    };
    setBarbers([...barbers, newBarber]);
  };

  const removeBarber = (id: string) => {
    setBarbers(barbers.filter(barber => barber.id !== id));
  };

  const updateBarber = (id: string, updates: Partial<BarberSettings>) => {
    setBarbers(barbers.map(barber => 
      barber.id === id ? { ...barber, ...updates } : barber
    ));
  };

  const addService = (categoryIndex: number) => {
    const newServices = [...services];
    newServices[categoryIndex].services.push({
      name: '',
      price: '',
      description: ''
    });
    setServices(newServices);
  };

  const removeService = (categoryIndex: number, serviceIndex: number) => {
    const newServices = [...services];
    newServices[categoryIndex].services.splice(serviceIndex, 1);
    setServices(newServices);
  };

  const updateService = (categoryIndex: number, serviceIndex: number, field: string, value: string) => {
    const newServices = [...services];
    newServices[categoryIndex].services[serviceIndex] = {
      ...newServices[categoryIndex].services[serviceIndex],
      [field]: value
    };
    setServices(newServices);
  };

  const handleSave = () => {
    toast({
      title: "Impostazioni salvate",
      description: "Le modifiche sono state salvate con successo"
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-salon-beige via-salon-white to-salon-beige">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-salon-black mb-2">
                Impostazioni Salone
              </h1>
              <p className="text-salon-black/70">
                Configura tutti gli aspetti del tuo salone
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                Salva Tutto
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline" 
                className="flex items-center gap-2 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Informazioni Generali */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl text-salon-black flex items-center gap-2">
                  <SettingsIcon className="h-6 w-6" />
                  Informazioni Generali
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Nome del Salone
                    </label>
                    <Input
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="Nome del salone"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Slogan
                    </label>
                    <Input
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      placeholder="Il tuo slogan"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-salon-black mb-2">
                    Logo (formato JPG)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".jpg,.jpeg"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Carica Logo
                      </Button>
                    </label>
                    {logoPreview && (
                      <img src={logoPreview} alt="Logo preview" className="h-12 w-12 object-cover rounded" />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Link Instagram
                    </label>
                    <Input
                      value={instagramLink}
                      onChange={(e) => setInstagramLink(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Link Facebook
                    </label>
                    <Input
                      value={facebookLink}
                      onChange={(e) => setFacebookLink(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestione Barbieri */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-playfair text-2xl text-salon-black">
                    Gestione Barbieri
                  </CardTitle>
                  <Button onClick={addBarber} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Aggiungi Barbiere
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {barbers.map((barber, index) => (
                  <div key={barber.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Input
                          value={barber.name}
                          onChange={(e) => updateBarber(barber.id, { name: e.target.value })}
                          placeholder="Nome barbiere"
                          className="w-48"
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={barber.isActive}
                            onCheckedChange={(checked) => updateBarber(barber.id, { isActive: checked })}
                          />
                          <span className="text-sm text-salon-black">Attivo</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeBarber(barber.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-xs">
                      {Object.entries(barber.workingHours).map(([day, hours]) => (
                        <div key={day} className="space-y-2">
                          <div className="font-medium capitalize text-center">{day.slice(0, 3)}</div>
                          <Switch
                            checked={hours.isActive}
                            onCheckedChange={(checked) => {
                              const newWorkingHours = { ...barber.workingHours };
                              newWorkingHours[day as keyof typeof barber.workingHours].isActive = checked;
                              updateBarber(barber.id, { workingHours: newWorkingHours });
                            }}
                          />
                          {hours.isActive && (
                            <div className="space-y-1">
                              <Input
                                type="time"
                                value={hours.start}
                                onChange={(e) => {
                                  const newWorkingHours = { ...barber.workingHours };
                                  newWorkingHours[day as keyof typeof barber.workingHours].start = e.target.value;
                                  updateBarber(barber.id, { workingHours: newWorkingHours });
                                }}
                                className="text-xs h-8"
                              />
                              <Input
                                type="time"
                                value={hours.end}
                                onChange={(e) => {
                                  const newWorkingHours = { ...barber.workingHours };
                                  newWorkingHours[day as keyof typeof barber.workingHours].end = e.target.value;
                                  updateBarber(barber.id, { workingHours: newWorkingHours });
                                }}
                                className="text-xs h-8"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Gestione Servizi e Prezzi */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl text-salon-black">
                  Servizi e Prezzi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {services.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-salon-black">{category.category}</h3>
                      <Button
                        onClick={() => addService(categoryIndex)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-3 w-3" />
                        Aggiungi Servizio
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {category.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="grid md:grid-cols-4 gap-3 items-end">
                          <div>
                            <label className="block text-xs font-medium text-salon-black mb-1">
                              Nome Servizio
                            </label>
                            <Input
                              value={service.name}
                              onChange={(e) => updateService(categoryIndex, serviceIndex, 'name', e.target.value)}
                              placeholder="Nome servizio"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-salon-black mb-1">
                              Prezzo
                            </label>
                            <Input
                              value={service.price}
                              onChange={(e) => updateService(categoryIndex, serviceIndex, 'price', e.target.value)}
                              placeholder="€25"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-salon-black mb-1">
                              Descrizione
                            </label>
                            <Input
                              value={service.description}
                              onChange={(e) => updateService(categoryIndex, serviceIndex, 'description', e.target.value)}
                              placeholder="Descrizione breve"
                              className="w-full"
                            />
                          </div>
                          <Button
                            onClick={() => removeService(categoryIndex, serviceIndex)}
                            variant="destructive"
                            size="sm"
                            className="h-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
