import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { format, isSameDay, addDays } from 'date-fns';
import { User, Clock } from 'lucide-react';
import { useBookings } from '@/contexts/BookingContext';

const BookingForm = () => {
  const { addBooking } = useBookings();
  const [step, setStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: ''
  });

  // Mock availability data - in a real app this would come from an API
  const getAvailableDates = (barber: string) => {
    const today = new Date();
    const availableDates: Date[] = [];
    
    // Generate available dates for the next 30 days (excluding Sundays for example)
    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i);
      if (date.getDay() !== 0) { // Exclude Sundays
        availableDates.push(date);
      }
    }
    
    return availableDates;
  };

  // Available time slots
  const getAvailableTimeSlots = (barber: string, date: Date) => {
    // Mock time slots - in a real app this would come from an API
    return [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30'
    ];
  };

  const availableDates = selectedBarber ? getAvailableDates(selectedBarber) : [];
  const availableTimeSlots = selectedBarber && selectedDate ? getAvailableTimeSlots(selectedBarber, selectedDate) : [];

  const handleBarberSelect = (barber: string) => {
    setSelectedBarber(barber);
    setSelectedDate(undefined);
    setSelectedTime('');
    setStep(2);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && availableDates.some(availableDate => isSameDay(availableDate, date))) {
      setSelectedDate(date);
      setSelectedTime('');
      setStep(3);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedBarber) {
      return;
    }

    const newBooking = {
      name: `${formData.name} ${formData.surname}`,
      phone: formData.phone,
      service: "Taglio + Barba", // Default service, could be made selectable
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      barber: selectedBarber,
      notes: ""
    };

    addBooking(newBooking);
    
    toast({
      title: "Prenotazione Confermata!",
      description: `Appuntamento prenotato con ${selectedBarber} per il ${selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''} alle ${selectedTime}.`,
    });
    
    // Reset form
    setStep(1);
    setSelectedBarber('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setFormData({ name: '', surname: '', phone: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetToStep = (stepNumber: number) => {
    setStep(stepNumber);
    if (stepNumber === 1) {
      setSelectedBarber('');
      setSelectedDate(undefined);
      setSelectedTime('');
    } else if (stepNumber === 2) {
      setSelectedDate(undefined);
      setSelectedTime('');
    } else if (stepNumber === 3) {
      setSelectedTime('');
    }
  };

  // Helper function to format date in Italian
  const formatDateInItalian = (date: Date) => {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${day} ${monthName} ${year}`;
  };

  return (
    <section id="booking" className="py-20 bg-urban-charcoal">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[Merriweather] text-5xl md:text-6xl font-black text-urban-white mb-4 tracking-wide">
              BOOK YOUR
              <span className="font-[Merriweather] text-primary"> SESSION</span>
            </h2>
            <p className="text-lg text-urban-silver max-w-2xl mx-auto font-urban font-light">
              Scegli il tuo urban stylist, seleziona una data e preparati per una trasformazione totale.
            </p>
          </div>

          <div className="urban-glass rounded-none shadow-2xl p-8 md:p-12 border border-urban-steel/30">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 border-2 ${step >= 1 ? 'border-urban-neon bg-urban-neon text-urban-black' : 'border-urban-steel text-urban-silver'} flex items-center justify-center text-sm font-bold font-display`}>
                  1
                </div>
                <div className={`w-16 h-1 ${step >= 2 ? 'bg-urban-neon' : 'bg-urban-steel'}`}></div>
                <div className={`w-10 h-10 border-2 ${step >= 2 ? 'border-urban-neon bg-urban-neon text-urban-black' : 'border-urban-steel text-urban-silver'} flex items-center justify-center text-sm font-bold font-display`}>
                  2
                </div>
                <div className={`w-16 h-1 ${step >= 3 ? 'bg-urban-neon' : 'bg-urban-steel'}`}></div>
                <div className={`w-10 h-10 border-2 ${step >= 3 ? 'border-urban-neon bg-urban-neon text-urban-black' : 'border-urban-steel text-urban-silver'} flex items-center justify-center text-sm font-bold font-display`}>
                  3
                </div>
                <div className={`w-16 h-1 ${step >= 4 ? 'bg-urban-neon' : 'bg-urban-steel'}`}></div>
                <div className={`w-10 h-10 border-2 ${step >= 4 ? 'border-urban-neon bg-urban-neon text-urban-black' : 'border-urban-steel text-urban-silver'} flex items-center justify-center text-sm font-bold font-display`}>
                  4
                </div>
              </div>
            </div>

            {/* Step 1: Barber Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-3xl font-display font-bold text-urban-white text-center mb-6 tracking-wide">
                  CHOOSE YOUR <span className="text-urban-neon">STYLIST</span>
                </h3>
                
                <RadioGroup value={selectedBarber} onValueChange={handleBarberSelect}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label htmlFor="selim" className="cursor-pointer">
                        <div className={`border-2 rounded-none p-6 transition-all duration-300 hover:border-urban-neon ${selectedBarber === 'Selim' ? 'border-urban-neon bg-urban-neon/10' : 'border-urban-steel'} urban-glass`}>
                          <div className="flex items-center space-x-3 mb-4">
                            <RadioGroupItem value="Selim" id="selim" />
                            <User className="w-8 h-8 p-1 bg-urban-steel rounded-sm text-urban-neon" />
                            <Label htmlFor="selim" className="text-xl font-bold text-urban-white cursor-pointer font-display tracking-wide">
                              SELIM
                            </Label>
                          </div>
                          <p className="text-urban-silver font-urban">
                            Master of contemporary cuts and urban styling. Specialista in fade tecnici e design innovativi.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="relative">
                      <label htmlFor="daniel" className="cursor-pointer">
                        <div className={`border-2 rounded-none p-6 transition-all duration-300 hover:border-urban-neon ${selectedBarber === 'Daniel' ? 'border-urban-neon bg-urban-neon/10' : 'border-urban-steel'} urban-glass`}>
                          <div className="flex items-center space-x-3 mb-4">
                            <RadioGroupItem value="Daniel" id="daniel" />
                            <User className="w-8 h-8 p-1 bg-urban-steel rounded-sm text-urban-electric" />
                            <Label htmlFor="daniel" className="text-xl font-bold text-urban-white cursor-pointer font-display tracking-wide">
                              DANIEL
                            </Label>
                          </div>
                          <p className="text-urban-silver font-urban">
                            Veterano dello street style con 15+ anni di esperienza. Precision cuts e urban transformations.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Date Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-display font-bold text-urban-white tracking-wide">
                    SELECT DATE - <span className="text-urban-neon">{selectedBarber}</span>
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => resetToStep(1)}
                    className="text-urban-neon border-urban-neon hover:bg-urban-neon hover:text-urban-black font-bold rounded-none"
                  >
                    CHANGE STYLIST
                  </Button>
                </div>
                
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      return date < new Date() || !availableDates.some(availableDate => isSameDay(availableDate, date));
                    }}
                    className="rounded-none border border-urban-steel urban-glass"
                    classNames={{
                      day_selected: "bg-urban-neon text-urban-black hover:bg-urban-neon hover:text-urban-black font-bold",
                      day_today: "bg-urban-steel text-urban-white font-bold",
                    }}
                  />
                </div>
                
                <p className="text-center text-urban-silver font-urban">
                  Le date evidenziate sono disponibili per {selectedBarber}. Clicca per continuare.
                </p>
              </div>
            )}

            {/* Step 3: Time Selection */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-display font-bold text-urban-white tracking-wide">
                    SELECT TIME - <span className="text-urban-electric">{selectedDate ? formatDateInItalian(selectedDate) : ''}</span>
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => resetToStep(2)}
                    className="text-urban-electric border-urban-electric hover:bg-urban-electric hover:text-urban-black font-bold rounded-none"
                  >
                    CHANGE DATE
                  </Button>
                </div>

                <div className="urban-glass rounded-none p-4 mb-6 border border-urban-steel/30">
                  <p className="text-urban-white font-urban font-medium">
                    <strong className="text-urban-neon">STYLIST:</strong> {selectedBarber}
                  </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`border-2 rounded-none p-4 transition-all duration-300 hover:border-urban-neon ${
                        selectedTime === time 
                          ? 'border-urban-neon bg-urban-neon/10 text-urban-neon' 
                          : 'border-urban-steel text-urban-white hover:text-urban-neon'
                      } urban-glass font-display font-bold tracking-wide flex items-center justify-center space-x-2`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{time}</span>
                    </button>
                  ))}
                </div>
                
                <p className="text-center text-urban-silver font-urban">
                  Seleziona un orario disponibile per continuare con la prenotazione.
                </p>
              </div>
            )}

            {/* Step 4: Personal Information */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-display font-bold text-urban-white tracking-wide">
                    COMPLETE <span className="text-urban-neon">BOOKING</span>
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => resetToStep(3)}
                    className="text-urban-electric border-urban-electric hover:bg-urban-electric hover:text-urban-black font-bold rounded-none"
                  >
                    CHANGE TIME
                  </Button>
                </div>

                <div className="urban-glass rounded-none p-4 mb-6 border border-urban-steel/30">
                  <p className="text-urban-white font-urban font-medium">
                    <strong className="text-urban-neon">STYLIST:</strong> {selectedBarber} <br />
                    <strong className="text-urban-electric">DATA:</strong> {selectedDate ? formatDateInItalian(selectedDate) : ''} <br />
                    <strong className="text-urban-neon">ORARIO:</strong> {selectedTime}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-urban-white font-medium font-urban uppercase tracking-wide">Nome *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-urban-steel focus:border-urban-neon bg-urban-charcoal text-urban-white rounded-none font-urban"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="surname" className="text-urban-white font-medium font-urban uppercase tracking-wide">Cognome *</Label>
                      <Input
                        id="surname"
                        type="text"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        className="border-urban-steel focus:border-urban-neon bg-urban-charcoal text-urban-white rounded-none font-urban"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-urban-white font-medium font-urban uppercase tracking-wide">Cellulare *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border-urban-steel focus:border-urban-neon bg-urban-charcoal text-urban-white rounded-none font-urban"
                      placeholder="+39 123 456 7890"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-urban-neon hover:bg-urban-neon/90 text-urban-black font-bold py-6 text-lg transition-all duration-300 hover:scale-105 rounded-none font-display tracking-wider uppercase shadow-2xl"
                  >
                    CONFERMA BOOKING
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
