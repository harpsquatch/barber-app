
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, Plus, Trash2, Save, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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

// ServiceCard component for displaying individual services
interface ServiceCardProps {
  service: {
    service_id: number;
    category: string;
    name: string;
    price: string;
  };
  editingService: {
    service_id: number;
    category: string;
    name: string;
    price: string;
  } | null;
  editServiceCategory: string;
  editServiceName: string;
  editServicePrice: string;
  onStartEdit: (service: any) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (serviceId: number, serviceName: string) => void;
  setEditServiceCategory: (value: string) => void;
  setEditServiceName: (value: string) => void;
  setEditServicePrice: (value: string) => void;
}

const ServiceCard = ({
  service,
  editingService,
  editServiceCategory,
  editServiceName,
  editServicePrice,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  setEditServiceCategory,
  setEditServiceName,
  setEditServicePrice
}: ServiceCardProps) => {
  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      {editingService?.service_id === service.service_id ? (
        // Edit mode
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-salon-black mb-2">
                Categoria
              </label>
              <Input
                value={editServiceCategory}
                onChange={e => setEditServiceCategory(e.target.value)}
                placeholder="Categoria"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-salon-black mb-2">
                Nome Servizio
              </label>
              <Input
                value={editServiceName}
                onChange={e => setEditServiceName(e.target.value)}
                placeholder="Nome del servizio"
                className="w-full"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-salon-black mb-2">
              Prezzo
            </label>
            <Input
              value={editServicePrice}
              onChange={e => setEditServicePrice(e.target.value)}
              placeholder="€25"
              className="w-full"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={onCancelEdit}
              variant="outline"
              size="sm"
            >
              Annulla
            </Button>
            <Button
              onClick={onSaveEdit}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
              disabled={!editServiceName.trim() || !editServiceCategory.trim()}
            >
              Salva
            </Button>
          </div>
        </div>
      ) : (
        // View mode
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium text-salon-black">ID: {service.service_id}</span>
              <span className="text-salon-black font-semibold">{service.name}</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onStartEdit(service)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <SettingsIcon className="h-4 w-4" />
                Modifica
              </Button>
              <Button
                onClick={() => onDelete(service.service_id, service.name)}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Elimina
              </Button>
            </div>
          </div>
          <p className="text-salon-black/80 text-sm">Categoria: {service.category}</p>
          <p className="text-salon-black/80 text-sm">Prezzo: {service.price}</p>
        </div>
      )}
    </div>
  );
};

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

  // Database-driven services state
  const [dbServices, setDbServices] = useState<Array<{
    service_id: number;
    category: string;
    name: string;
    price: string;
  }>>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Add service state
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceId, setNewServiceId] = useState<number>(1);

  // Edit service state
  const [editingService, setEditingService] = useState<{
    service_id: number;
    category: string;
    name: string;
    price: string;
  } | null>(null);
  const [editServiceCategory, setEditServiceCategory] = useState('');
  const [editServiceName, setEditServiceName] = useState('');
  const [editServicePrice, setEditServicePrice] = useState('');

  // Tab state for services
  const [activeServiceTab, setActiveServiceTab] = useState('all');

  // Helper function to get unique categories
  const getServiceCategories = () => {
    const categories = [...new Set(dbServices.map(service => service.category))];
    return categories.sort();
  };

  // Helper function to get services by category
  const getServicesByCategory = (category: string) => {
    if (category === 'all') {
      return dbServices;
    }
    return dbServices.filter(service => service.category === category);
  };

  const [generalInfo, setGeneralInfo] = useState({
    name: '',
    slogan: '',
    gallery_title: '',
    pricing_title: '',
    team_title: '',
    address: '',
    phone: '',
    email: '',
    instagram_link: '',
    facebook_link: ''
  });

  const [newLogoImage, setNewLogoImage] = useState('');
  const [newShopImage, setNewShopImage] = useState('');
  const [newTeamImage, setNewTeamImage] = useState('');

  // Barber management state
  const [dbBarbers, setDbBarbers] = useState<Array<{ barber_id: number; name: string; description: string }>>([]);
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberDescription, setNewBarberDescription] = useState('');
  const [newBarberId, setNewBarberId] = useState<number>(1);
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(false);

  // Edit barber state
  const [editingBarber, setEditingBarber] = useState<{ barber_id: number; name: string; description: string } | null>(null);
  const [editBarberName, setEditBarberName] = useState('');
  const [editBarberDescription, setEditBarberDescription] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function fetchOrCreateGeneralInfo() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try to fetch the existing row
      const { data, error } = await supabase
        .from('general_info')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        // Row exists, set the state with fetched data
        setGeneralInfo({
          name: data.name || '',
          slogan: data.slogan || '',
          gallery_title: data.gallery_title || '',
          pricing_title: data.pricing_title || '',
          team_title: data.team_title || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          instagram_link: data.instagram_link || '',
          facebook_link: data.facebook_link || ''
        });
        console.log('Fetched general_info:', data);
      } else if (error && error.code === 'PGRST116') {
        // Row doesn't exist (PGRST116 is "not found" error), create it
        const { error: insertError } = await supabase
          .from('general_info')
          .insert([{ 
            user_id: user.id, 
            name: 'My Salon',
            slogan: '',
            gallery_title: '',
            pricing_title: '',
            team_title: '',
            address: '',
            phone: '',
            email: '',
            instagram_link: '',
            facebook_link: ''
          }]);
        
        if (insertError) {
          console.error('Error inserting general_info:', insertError);
          toast({
            title: 'Errore',
            description: 'Errore durante la creazione delle informazioni generali',
            variant: 'destructive',
          });
        } else {
          // Set state with default values after successful insert
          setGeneralInfo({
            name: 'My Salon',
            slogan: '',
            gallery_title: '',
            pricing_title: '',
            team_title: '',
            address: '',
            phone: '',
            email: '',
            instagram_link: '',
            facebook_link: ''
          });
          console.log('Created new general_info row');
        }
      } else if (error) {
        // Some other error occurred
        console.error('Error fetching general_info:', error);
        toast({
          title: 'Errore',
          description: 'Errore durante il caricamento delle informazioni generali',
          variant: 'destructive',
        });
      }
    }
    fetchOrCreateGeneralInfo();
  }, [toast]);

  // Fetch barbers from database
  useEffect(() => {
    async function fetchBarbers() {
      setIsLoadingBarbers(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('barbers')
        .select('barber_id, name, description')
        .eq('user_id', user.id)
        .order('barber_id');
      
      if (error) {
        console.error('Error fetching barbers:', error);
        toast({
          title: 'Errore',
          description: 'Errore durante il caricamento dei barbieri',
          variant: 'destructive',
        });
      } else {
        setDbBarbers(data || []);
        // Set the next available barber_id
        if (data && data.length > 0) {
          const maxId = Math.max(...data.map(b => b.barber_id));
          setNewBarberId(maxId + 1);
        }
      }
      setIsLoadingBarbers(false);
    }
    fetchBarbers();
  }, [toast]);

  // Fetch services from database
  useEffect(() => {
    async function fetchServices() {
      setIsLoadingServices(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('services')
        .select('service_id, category, name, price')
        .eq('user_id', user.id)
        .order('service_id');
      
      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: 'Errore',
          description: 'Errore durante il caricamento dei servizi',
          variant: 'destructive',
        });
      } else {
        setDbServices(data || []);
        // Set the next available service_id
        if (data && data.length > 0) {
          const maxId = Math.max(...data.map(s => s.service_id));
          setNewServiceId(maxId + 1);
        }
      }
      setIsLoadingServices(false);
    }
    fetchServices();
  }, [toast]);

  const handleAddBarber = async () => {
    if (!newBarberName.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci un nome per il barbiere',
        variant: 'destructive',
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('barbers')
      .upsert([{ 
        barber_id: newBarberId, 
        user_id: user.id,
        name: newBarberName.trim(), 
        description: newBarberDescription.trim() 
      }]);

    if (error) {
      console.error('Error adding barber:', error);
      toast({
        title: 'Errore',
        description: `Errore durante l'aggiunta del barbiere: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Barbiere aggiunto',
        description: `${newBarberName} è stato aggiunto con successo`,
      });
      // Refresh the barbers list
      const { data } = await supabase
        .from('barbers')
        .select('barber_id, name, description')
        .eq('user_id', user.id)
        .order('barber_id');
      
      if (data) {
        setDbBarbers(data);
        const maxId = Math.max(...data.map(b => b.barber_id));
        setNewBarberId(maxId + 1);
      }
      
      setNewBarberName('');
      setNewBarberDescription('');
    }
  };

  const handleDeleteBarber = async (barberId: number, barberName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('barbers')
      .delete()
      .eq('barber_id', barberId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting barber:', error);
      toast({
        title: 'Errore',
        description: `Errore durante l'eliminazione del barbiere: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Barbiere eliminato',
        description: `${barberName} è stato eliminato con successo`,
      });
      // Refresh the barbers list
      const { data } = await supabase
        .from('barbers')
        .select('barber_id, name, description')
        .eq('user_id', user.id)
        .order('barber_id');
      
      if (data) {
        setDbBarbers(data);
        const maxId = Math.max(...data.map(b => b.barber_id));
        setNewBarberId(maxId + 1);
      }
    }
  };

  const handleStartEdit = (barber: { barber_id: number; name: string; description: string }) => {
    setEditingBarber(barber);
    setEditBarberName(barber.name);
    setEditBarberDescription(barber.description || '');
  };

  const handleSaveEdit = async () => {
    if (!editingBarber || !editBarberName.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci un nome per il barbiere',
        variant: 'destructive',
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('barbers')
      .update({ 
        name: editBarberName.trim(), 
        description: editBarberDescription.trim() 
      })
      .eq('barber_id', editingBarber.barber_id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating barber:', error);
      toast({
        title: 'Errore',
        description: `Errore durante l'aggiornamento del barbiere: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Barbiere aggiornato',
        description: `${editBarberName} è stato aggiornato con successo`,
      });
      // Refresh the barbers list
      const { data } = await supabase
        .from('barbers')
        .select('barber_id, name, description')
        .eq('user_id', user.id)
        .order('barber_id');
      
      if (data) {
        setDbBarbers(data);
      }
      
      // Reset edit state
      setEditingBarber(null);
      setEditBarberName('');
      setEditBarberDescription('');
    }
  };

  const handleCancelEdit = () => {
    setEditingBarber(null);
    setEditBarberName('');
    setEditBarberDescription('');
  };

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

  const handleAddService = async () => {
    if (!newServiceName.trim() || !newServiceCategory.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci categoria e nome del servizio',
        variant: 'destructive',
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('services')
      .upsert([{ 
        service_id: newServiceId, 
        user_id: user.id,
        category: newServiceCategory.trim(), 
        name: newServiceName.trim(), 
        price: newServicePrice.trim()
      }]);

    if (error) {
      console.error('Error adding service:', error);
      toast({
        title: 'Errore',
        description: `Errore durante l'aggiunta del servizio: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Servizio aggiunto',
        description: `${newServiceName} è stato aggiunto con successo`,
      });
      // Refresh the services list
      const { data } = await supabase
        .from('services')
        .select('service_id, category, name, price')
        .eq('user_id', user.id)
        .order('service_id');
      
      if (data) {
        setDbServices(data);
        const maxId = Math.max(...data.map(s => s.service_id));
        setNewServiceId(maxId + 1);
      }
      
      // Reset form
      setNewServiceCategory('');
      setNewServiceName('');
      setNewServicePrice('');
    }
  };

  const handleDeleteService = async (serviceId: number, serviceName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('service_id', serviceId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Errore',
        description: `Errore durante l'eliminazione del servizio: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Servizio eliminato',
        description: `${serviceName} è stato eliminato con successo`,
      });
      // Refresh the services list
      const { data } = await supabase
        .from('services')
        .select('service_id, category, name, price')
        .eq('user_id', user.id)
        .order('service_id');
      
      if (data) {
        setDbServices(data);
        const maxId = Math.max(...data.map(s => s.service_id));
        setNewServiceId(maxId + 1);
      }
    }
  };

  const handleStartEditService = (service: {
    service_id: number;
    category: string;
    name: string;
    price: string;
  }) => {
    setEditingService(service);
    setEditServiceCategory(service.category);
    setEditServiceName(service.name);
    setEditServicePrice(service.price);
  };

  const handleSaveEditService = async () => {
    if (!editingService || !editServiceName.trim() || !editServiceCategory.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci categoria e nome del servizio',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('services')
      .update({ 
        category: editServiceCategory.trim(),
        name: editServiceName.trim(), 
        price: editServicePrice.trim()
      })
      .eq('service_id', editingService.service_id);

    if (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Errore',
        description: `Errore durante l'aggiornamento del servizio: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Servizio aggiornato',
        description: `${editServiceName} è stato aggiornato con successo`,
      });
      // Refresh the services list
      const { data } = await supabase
        .from('services')
        .select('service_id, category, name, price')
        .order('service_id');
      
      if (data) {
        setDbServices(data);
      }
      
      // Reset edit state
      setEditingService(null);
      setEditServiceCategory('');
      setEditServiceName('');
      setEditServicePrice('');
    }
  };

  const handleCancelEditService = () => {
    setEditingService(null);
    setEditServiceCategory('');
    setEditServiceName('');
    setEditServicePrice('');
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



  const handleSave = async () => {
    // Get the current user's ID from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Errore',
        description: 'Utente non autenticato',
        variant: 'destructive',
      });
      return;
    }

    // Save general info to Supabase
    console.log('Payload being sent to Supabase:', generalInfo);
    const { error } = await supabase
      .from('general_info')
      .update(generalInfo)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error updating general_info:', error);
      toast({
        title: 'Errore',
        description: `Errore durante il salvataggio: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Impostazioni salvate',
        description: 'Le modifiche alle informazioni generali sono state salvate con successo',
      });
    }
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
                      value={generalInfo.name}
                      onChange={e => setGeneralInfo({ ...generalInfo, name: e.target.value })}
                      placeholder="Nome del salone"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Slogan
                    </label>
                    <Input
                      value={generalInfo.slogan}
                      onChange={e => setGeneralInfo({ ...generalInfo, slogan: e.target.value })}
                      placeholder="Il tuo slogan"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Gallery Title
                    </label>
                    <Input
                      value={generalInfo.gallery_title}
                      onChange={e => setGeneralInfo({ ...generalInfo, gallery_title: e.target.value })}
                      placeholder="Gallery Title"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Pricing Title
                    </label>
                    <Input
                      value={generalInfo.pricing_title}
                      onChange={e => setGeneralInfo({ ...generalInfo, pricing_title: e.target.value })}
                      placeholder="Pricing Title"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Team Title
                    </label>
                    <Input
                      value={generalInfo.team_title}
                      onChange={e => setGeneralInfo({ ...generalInfo, team_title: e.target.value })}
                      placeholder="Team Title"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Address
                    </label>
                    <Input
                      value={generalInfo.address}
                      onChange={e => setGeneralInfo({ ...generalInfo, address: e.target.value })}
                      placeholder="Address"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Phone
                    </label>
                    <Input
                      value={generalInfo.phone}
                      onChange={e => setGeneralInfo({ ...generalInfo, phone: e.target.value })}
                      placeholder="Phone"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Email
                    </label>
                    <Input
                      value={generalInfo.email}
                      onChange={e => setGeneralInfo({ ...generalInfo, email: e.target.value })}
                      placeholder="Email"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Instagram
                    </label>
                    <Input
                      value={generalInfo.instagram_link}
                      onChange={e => setGeneralInfo({ ...generalInfo, instagram_link: e.target.value })}
                      placeholder="Instagram"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Facebook
                    </label>
                    <Input
                      value={generalInfo.facebook_link}
                      onChange={e => setGeneralInfo({ ...generalInfo, facebook_link: e.target.value })}
                      placeholder="Facebook"
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestione Barbieri */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl text-salon-black flex items-center gap-2">
                  <SettingsIcon className="h-6 w-6" />
                  Gestione Barbieri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add new barber */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg text-salon-black mb-4">Aggiungi Nuovo Barbiere</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-salon-black mb-2">
                        ID Barbiere
                      </label>
                      <Input
                        type="number"
                        value={newBarberId}
                        onChange={e => setNewBarberId(parseInt(e.target.value) || 1)}
                        placeholder="ID"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-salon-black mb-2">
                        Nome Barbiere
                      </label>
                      <Input
                        value={newBarberName}
                        onChange={e => setNewBarberName(e.target.value)}
                        placeholder="Nome del barbiere"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-salon-black mb-2">
                      Descrizione
                    </label>
                    <Textarea
                      value={newBarberDescription}
                      onChange={e => setNewBarberDescription(e.target.value)}
                      placeholder="Descrizione del barbiere (esperienza, specialità, ecc.)"
                      className="w-full"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddBarber}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      disabled={!newBarberName.trim()}
                    >
                      <Plus className="h-4 w-4" />
                      Aggiungi
                    </Button>
                  </div>
                </div>

                {/* Existing barbers list */}
                <div>
                  <h3 className="font-semibold text-lg text-salon-black mb-4">Barbieri Esistenti</h3>
                  {isLoadingBarbers ? (
                    <div className="text-center py-4">
                      <p className="text-salon-black/70">Caricamento barbieri...</p>
                    </div>
                  ) : dbBarbers.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <p className="text-salon-black/70">Nessun barbiere trovato</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dbBarbers.map((barber) => (
                        <div key={barber.barber_id} className="border rounded-lg bg-white overflow-hidden">
                          {editingBarber?.barber_id === barber.barber_id ? (
                            // Edit mode
                            <div className="p-4">
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-salon-black mb-2">
                                    Nome Barbiere
                                  </label>
                                  <Input
                                    value={editBarberName}
                                    onChange={e => setEditBarberName(e.target.value)}
                                    placeholder="Nome del barbiere"
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-salon-black mb-2">
                                    ID Barbiere
                                  </label>
                                  <Input
                                    value={barber.barber_id}
                                    disabled
                                    className="w-full bg-gray-100"
                                  />
                                </div>
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-salon-black mb-2">
                                  Descrizione
                                </label>
                                <Textarea
                                  value={editBarberDescription}
                                  onChange={e => setEditBarberDescription(e.target.value)}
                                  placeholder="Descrizione del barbiere (esperienza, specialità, ecc.)"
                                  className="w-full"
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  onClick={handleCancelEdit}
                                  variant="outline"
                                  size="sm"
                                >
                                  Annulla
                                </Button>
                                <Button
                                  onClick={handleSaveEdit}
                                  className="bg-green-600 hover:bg-green-700"
                                  size="sm"
                                  disabled={!editBarberName.trim()}
                                >
                                  Salva
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <>
                              <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                                <div className="flex items-center gap-4">
                                  <span className="font-medium text-salon-black">ID: {barber.barber_id}</span>
                                  <span className="text-salon-black font-semibold">{barber.name}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleStartEdit(barber)}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                  >
                                    <SettingsIcon className="h-4 w-4" />
                                    Modifica
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteBarber(barber.barber_id, barber.name)}
                                    variant="destructive"
                                    size="sm"
                                    className="flex items-center gap-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Elimina
                                  </Button>
                                </div>
                              </div>
                              {barber.description && (
                                <div className="p-3">
                                  <p className="text-salon-black/80 text-sm">{barber.description}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                {/* Add new service */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg text-salon-black mb-4">Aggiungi Nuovo Servizio</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-salon-black mb-2">
                        Categoria
                      </label>
                      <Input
                        value={newServiceCategory}
                        onChange={e => setNewServiceCategory(e.target.value)}
                        placeholder="Categoria (es. Taglio, Colore, Rizzatura)"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-salon-black mb-2">
                        Nome Servizio
                      </label>
                      <Input
                        value={newServiceName}
                        onChange={e => setNewServiceName(e.target.value)}
                        placeholder="Nome del servizio"
                        className="w-full"
                      />
                    </div>
                  </div>
                                     <div className="mb-4">
                     <label className="block text-sm font-medium text-salon-black mb-2">
                       Prezzo
                     </label>
                     <Input
                       value={newServicePrice}
                       onChange={e => setNewServicePrice(e.target.value)}
                       placeholder="€25"
                       className="w-full"
                     />
                   </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddService}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      disabled={!newServiceName.trim() || !newServiceCategory.trim()}
                    >
                      <Plus className="h-4 w-4" />
                      Aggiungi Servizio
                    </Button>
                  </div>
                </div>

                {/* Existing services list with tabs */}
                <div>
                  <h3 className="font-semibold text-lg text-salon-black mb-4">Servizi Esistenti</h3>
                  {isLoadingServices ? (
                    <div className="text-center py-4">
                      <p className="text-salon-black/70">Caricamento servizi...</p>
                    </div>
                  ) : dbServices.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <p className="text-salon-black/70">Nessun servizio trovato</p>
                    </div>
                  ) : (
                    <Tabs value={activeServiceTab} onValueChange={setActiveServiceTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        <TabsTrigger value="all" className="text-sm">Tutti</TabsTrigger>
                        {getServiceCategories().map((category) => (
                          <TabsTrigger key={category} value={category} className="text-sm">
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      <TabsContent value="all" className="mt-4">
                        <div className="space-y-3">
                          {getServicesByCategory('all').map((service) => (
                            <ServiceCard 
                              key={service.service_id} 
                              service={service}
                              editingService={editingService}
                              editServiceCategory={editServiceCategory}
                              editServiceName={editServiceName}
                              editServicePrice={editServicePrice}
                              onStartEdit={handleStartEditService}
                              onSaveEdit={handleSaveEditService}
                              onCancelEdit={handleCancelEditService}
                              onDelete={handleDeleteService}
                              setEditServiceCategory={setEditServiceCategory}
                              setEditServiceName={setEditServiceName}
                              setEditServicePrice={setEditServicePrice}
                            />
                          ))}
                        </div>
                      </TabsContent>
                      
                      {getServiceCategories().map((category) => (
                        <TabsContent key={category} value={category} className="mt-4">
                          <div className="space-y-3">
                            {getServicesByCategory(category).map((service) => (
                              <ServiceCard 
                                key={service.service_id} 
                                service={service}
                                editingService={editingService}
                                editServiceCategory={editServiceCategory}
                                editServiceName={editServiceName}
                                editServicePrice={editServicePrice}
                                onStartEdit={handleStartEditService}
                                onSaveEdit={handleSaveEditService}
                                onCancelEdit={handleCancelEditService}
                                onDelete={handleDeleteService}
                                setEditServiceCategory={setEditServiceCategory}
                                setEditServiceName={setEditServiceName}
                                setEditServicePrice={setEditServicePrice}
                              />
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
