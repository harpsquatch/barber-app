import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { format, isSameDay, addDays } from 'date-fns';
import { User, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const BackButton = ({
  onClick,
  filled = false,
}: {
  onClick: () => void;
  filled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex items-center justify-center text-2xl font-bold transition-all duration-300
      rounded-2xl w-12 h-12
      ${filled
        ? 'bg-[#FFD5B1] text-urban-black shadow'
        : 'bg-transparent text-urban-neon'}
    `}
    aria-label="Back"
  >
    &lt;
  </button>
);

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: ''
  });
  const [barbers, setBarbers] = useState<{ barber_id: number; name: string; description?: string }[]>([]);
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(true);
  const [workingHours, setWorkingHours] = useState<Record<string, any[]>>({});
  const [isLoadingHours, setIsLoadingHours] = useState(false);

  // Fetch working hours from database
  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        setIsLoadingHours(true);
        const { data, error } = await supabase
          .from('barber_working_hours')
          .select('*');

        if (error) {
          console.error('Error fetching working hours:', error);
          return;
        }

        // Group working hours by barber_id
        const grouped = {};
        if (data) {
          data.forEach(hour => {
            if (!grouped[hour.barber_id]) {
              grouped[hour.barber_id] = [];
            }
            grouped[hour.barber_id].push(hour);
          });
        }
        setWorkingHours(grouped);
      } catch (error) {
        console.error('Error fetching working hours:', error);
      } finally {
        setIsLoadingHours(false);
      }
    };

    fetchWorkingHours();
  }, []);

  // Get available dates based on working hours
  const getAvailableDates = (barber: string) => {
    const today = new Date();
    const availableDates: Date[] = [];
    
    // Find the barber's working hours
    const barberData = barbers.find(b => b.name === barber);
    if (!barberData) return [];

    const barberHours = workingHours[barberData.barber_id] || [];
    
    // Generate available dates for the next 30 days
    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      
      // Convert JavaScript day (0=Sunday) to our day format (Mon, Tue, etc.)
      const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayKey = dayMap[dayOfWeek];
      
      // Check if the barber works on this day
      const daySchedule = barberHours.find(h => h.day === dayKey);
      if (daySchedule && daySchedule.available) {
        availableDates.push(date);
      }
    }
    
    return availableDates;
  };

  // Generate time slots based on working hours (same logic as ModernCalendar)
  const generateTimeSlots = (start: string, end: string, interval = 30) => {
    const slots: string[] = [];
    let [hour, minute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    while (hour < endHour || (hour === endHour && minute <= endMinute)) {
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      );
      minute += interval;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  };

  const getAvailableTimeSlots = (barber: string, date: Date) => {
    const barberData = barbers.find(b => b.name === barber);
    if (!barberData) return [];

    const barberHours = workingHours[barberData.barber_id] || [];
    const dayOfWeek = date.getDay();
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayKey = dayMap[dayOfWeek];
    
    const daySchedule = barberHours.find(h => h.day === dayKey);
    if (!daySchedule || !daySchedule.available) return [];

    // Use the same generateTimeSlots function as ModernCalendar
    return generateTimeSlots(daySchedule.start, daySchedule.end, 30);
  };

  // Fetch barbers from database
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setIsLoadingBarbers(true);
        const { data, error } = await supabase
          .from('barbers')
          .select('barber_id, name, description')
          .order('barber_id');

        if (error) {
          console.error('Error fetching barbers:', error);
          toast({
            title: "Errore",
            description: "Impossibile caricare i barbieri.",
            variant: "destructive"
          });
          return;
        }

        setBarbers(data || []);
      } catch (error) {
        console.error('Error fetching barbers:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i barbieri.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingBarbers(false);
      }
    };

    fetchBarbers();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedBarber) {
      return;
    }

    try {
      // Get barber_id from the selected barber name
      const { data: barbers, error: barberError } = await supabase
        .from('barbers')
        .select('barber_id')
        .eq('name', selectedBarber)
        .single();

      if (barberError) {
        console.error('Error finding barber:', barberError);
        toast({
          title: "Errore",
          description: "Errore durante la prenotazione. Riprova.",
          variant: "destructive"
        });
        return;
      }

      const newBooking = {
        name: `${formData.name} ${formData.surname}`,
        phone: formData.phone,
        service: "Taglio + Barba", // Default service, could be made selectable
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        barber_id: barbers.barber_id,
        status: 'pending'
      };

      const { error } = await supabase
        .from('bookings')
        .insert([newBooking]);

      if (error) {
        console.error('Error creating booking:', error);
        toast({
          title: "Errore",
          description: "Errore durante la prenotazione. Riprova.",
          variant: "destructive"
        });
        return;
      }

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
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Errore",
        description: "Errore durante la prenotazione. Riprova.",
        variant: "destructive"
      });
    }
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

  const progressWidths = ['0%', '33.33%', '66.66%', '100%'];
  const progressWidth = progressWidths[step - 1];

  return (
    <div id="booking" className="w-full max-w-lg">
      <div className="urban-glass rounded-2xl shadow-2xl p-8 md:p-12 border border-urban-steel/30">
        {/* Step 1: Barber Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-3xl font-display font-bold text-urban-white text-center mb-6 tracking-wide">
              CHOOSE YOUR <span className="text-urban-neon font-[kaushan]">Stylist</span>
            </h3>
            
            {isLoadingBarbers ? (
              <div className="text-center py-8">
                <p className="text-urban-silver font-urban">Caricamento barbieri...</p>
              </div>
            ) : barbers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-urban-silver font-urban">Nessun barbiere disponibile al momento.</p>
              </div>
            ) : (
              <RadioGroup value={selectedBarber} onValueChange={handleBarberSelect}>
                <div className="grid md:grid-cols-2 gap-6">
                  {barbers.map((barber) => (
                    <div key={barber.barber_id} className="relative">
                      <label htmlFor={`barber-${barber.barber_id}`} className="cursor-pointer">
                        <div className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:border-urban-neon ${selectedBarber === barber.name ? 'border-urban-neon bg-urban-neon/10' : 'border-urban-steel'} urban-glass`}>
                          <div className="flex items-center space-x-3 mb-4">
                            <RadioGroupItem value={barber.name} id={`barber-${barber.barber_id}`} className="hidden" />
                            <User className="w-8 h-8 p-1 bg-urban-steel rounded-sm text-urban-neon" />
                            <Label htmlFor={`barber-${barber.barber_id}`} className="text-xl font-bold text-urban-white cursor-pointer font-display tracking-wide">
                              {barber.name.toUpperCase()}
                            </Label>
                          </div>
                          <p className="text-urban-silver font-urban text-[12px] text-center ">
                            {barber.description || 'Barbiere esperto'}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <div className="space-y-">
            <div className="justify-between">
              <h3 className="text-3xl font-semibold text-urban-white text-center mb-4 tracking-wide">
              Select<span className="text-urban-neon font-[kaushan]">Date</span>
              </h3>
            </div>
            {/* Add the box here */}
            <div className="urban-glass rounded-2xl p-4 mb-6 border border-urban-steel/30">
              <p className="text-urban-white font-urban font-medium">
                <strong className="text-urban-neon">STYLIST:</strong> {selectedBarber}
              </p>
            </div>
            {isLoadingHours ? (
              <div className="text-center py-8">
                <p className="text-urban-silver font-urban">Caricamento orari disponibili...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      return date < new Date() || !availableDates.some(availableDate => isSameDay(availableDate, date));
                    }}
                    className="rounded-2xl border border-urban-steel urban-glass text-[#FFD5B1]"
                    classNames={{
                      day_selected: "bg-urban-neon text-urban-black hover:bg-urban-neon hover:text-urban-black font-bold",
                      day_today: "bg-urban-steel text-urban-white font-bold",
                    }}
                  />
                </div>
                
                <p className="text-center text-urban-silver font-urban">
                  {availableDates.length > 0 
                    ? `Le date evidenziate sono disponibili per ${selectedBarber}. Clicca per continuare.`
                    : `Nessuna data disponibile per ${selectedBarber} nei prossimi 30 giorni.`
                  }
                </p>
              </>
            )}
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="items-center justify-between">
              <h3 className="text-3xl font-semibold text-urban-white text-center mb-4 tracking-wide">
              Select<span className="text-urban-neon font-[kaushan]">Time</span>
              </h3>
            </div>

            <div className="urban-glass rounded-2xl p-4 mb-6 border border-urban-steel/30">
              <p className="text-urban-white font-urban font-medium mb-1">
                <strong className="text-urban-neon">STYLIST:</strong> {selectedBarber}
              </p>
              <p className="text-urban-white font-urban font-medium">
                <strong className="text-urban-electric">DATE:</strong> {selectedDate ? formatDateInItalian(selectedDate) : ''}
              </p>
            </div>

            {isLoadingHours ? (
              <div className="text-center py-8">
                <p className="text-urban-silver font-urban">Caricamento orari disponibili...</p>
              </div>
            ) : availableTimeSlots.length > 0 ? (
              <>
                <div className="max-h-64 overflow-y-auto pr-2">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`border-2 rounded-2xl p-4 transition-all duration-300 hover:border-urban-neon w-full h-16 ${
                          selectedTime === time 
                            ? 'border-urban-neon bg-urban-neon/10 text-urban-neon' 
                            : 'border-urban-steel text-urban-white hover:text-urban-neon'
                        } urban-glass font-display font-bold tracking-wide flex items-center justify-center`}
                      >
                        <span className="text-sm">{time}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <p className="text-center text-urban-silver font-urban">
                  Seleziona un orario disponibile per continuare con la prenotazione.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-urban-silver font-urban">
                  Nessun orario disponibile per questa data. Seleziona un'altra data.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Personal Information */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="items-center justify-between">
              <h3 className="text-3xl font-semibold text-urban-white text-center mb-4 tracking-wide">
              Complete<span className="text-urban-neon font-[kaushan]">Booking</span>
              </h3>
            </div>

            <div className="urban-glass rounded-2xl p-4 mb-6 border border-urban-steel/30">
              <p className="text-urban-white font-urban font-medium">
                <strong className="text-urban-neon">STYLIST:</strong> {selectedBarber} <br />
                <strong className="text-urban-electric">DATA:</strong> {selectedDate ? formatDateInItalian(selectedDate) : ''} <br />
                <strong className="text-urban-neon">ORARIO:</strong> {selectedTime}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" id="booking-form">
              <div className="grid md:grid-cols-2 gap-6 ">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-urban-white font-medium font-urban uppercase tracking-wide">Nome *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-urban-steel focus:border-urban-neon bg-urban-charcoal text-urban-white rounded-none font-urban rounded-xl"
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
                    className="border-urban-steel focus:border-urban-neon bg-urban-charcoal text-urban-white rounded-none font-urban rounded-xl"
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
                  className="border-urban-steel focus:border-urban-neon bg-urban-charcoal text-urban-white rounded-none font-urban rounded-xl"
                  placeholder="+39 123 456 7890"
                  required
                />
              </div>

              {/* The "CONFERMA BOOKING" button is now outside the form */}
            </form>
          </div>
        )}
        {/* Progress Bar at the bottom */}
        <div className="w-full mt-8 flex items-center gap-2 justify-center">
          {/* Back button, only show on steps 2, 3, 4 */}
          {step > 1 && (
            <BackButton
              onClick={() => resetToStep(step - 1)}
              filled={step === 4}
            />
          )}
          <button
            type="submit"
            disabled={step !== 4}
            className={`
              relative transition-all duration-700 ease-in-out
              rounded-2xl overflow-hidden
              focus:outline-none
              ${step === 4 ? 'w-full h-12 cursor-pointer' : 'w-2/3 h-2 cursor-default pointer-events-none'}
              bg-urban-steel/40
              flex items-center justify-center
            `}
            style={{
              boxShadow: step === 4 ? '0 4px 24px 0 rgba(0,0,0,0.10)' : undefined,
              minWidth: step === 4 ? undefined : '120px',
            }}
          >
            {/* Progress bar fill */}
            <div
              className={`
                absolute left-0 top-0 transition-all duration-700 ease-in-out rounded-2xl
                ${step === 4 ? 'bg-urban-neon w-full h-full' : 'bg-urban-neon'}
              `}
              style={{
                width: step === 4 ? '100%' : progressWidth,
                height: step === 4 ? '100%' : '100%',
                zIndex: 1,
              }}
            />
            {/* Button text, fades in on step 4 */}
            <span
              className={`
                absolute left-0 top-0 w-full h-full flex items-center justify-center
                text-lg font-bold font-[Poppins] uppercase 
                transition-all duration-500
                ${step === 4 ? 'opacity-100 text-urban-black' : 'opacity-0'}
              `}
              style={{ zIndex: 2 }}
            >
              CONFERMA BOOKING
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
