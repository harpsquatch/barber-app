import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import { Booking } from '@/contexts/BookingContext';
import WeeklyHoursEditor from './WeeklyHoursEditor';
import { supabase } from '@/lib/supabase';

interface ModernCalendarProps {
  bookings: Booking[];
}

function generateTimeSlots(start: string, end: string, interval = 30) {
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
}

type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

type WorkingHour = {
  day: DayOfWeek;
  available: boolean;
  start?: string; // e.g. "09:00"
  end?: string;   // e.g. "17:00"
};

type BarberSchedule = {
  barber: string;
  hours: WorkingHour[];
};

const days = [
  { key: 'Mon', label: 'Lun' },
  { key: 'Tue', label: 'Mar' },
  { key: 'Wed', label: 'Mer' },
  { key: 'Thu', label: 'Gio' },
  { key: 'Fri', label: 'Ven' },
  { key: 'Sat', label: 'Sab' },
  { key: 'Sun', label: 'Dom' },
];

const defaultWeekly = days.map(d => ({
  day: d.key,
  available: true,
  start: '09:00',
  end: '17:30',
  unavailable: [], // <-- add this
}));

const ModernCalendar = ({ bookings }: ModernCalendarProps) => {
  // Tab state
  const [tab, setTab] = useState<'hours' | 'slots'>('hours');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [schedule, setSchedule] = useState({
    Selim: defaultWeekly,
    Daniel: defaultWeekly.map(s => ({ ...s, start: '10:00', end: '18:00' })),
  });
  const [barbers, setBarbers] = useState<{ barber_id: number, name: string }[]>([]);

  useEffect(() => {
    const fetchBarbers = async () => {
      const { data, error } = await supabase.from('barbers').select('*');
      console.log('Barbers fetch result:', { data, error });
      setBarbers(data || []);
    };
    fetchBarbers();
  }, []);

  // Auto-select first barber when barbers list loads
  useEffect(() => {
    if (barbers.length > 0 && !selectedBarber) {
      setSelectedBarber(barbers[0].name);
    }
  }, [barbers, selectedBarber]);

  const barberWorkingHours: Record<string, { start: string; end: string }> = {
    Selim: { start: '09:00', end: '17:30' },
    Daniel: { start: '10:00', end: '18:00' },
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  const getBookingForSlot = (date: Date, time: string, barber: string) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.find(booking => 
      booking.date === dateString && 
      booking.time === time && 
      booking.barber === barber
    );
  };

  const getSlotStatus = (date: Date, time: string, barber: string) => {
    const booking = getBookingForSlot(date, time, barber);
    if (!booking) return 'available';
    if (booking.status === 'confirmed') return 'booked';
    if (booking.status === 'cancelled') return 'cancelled';
    return 'pending';
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-blue-300 hover:bg-blue-400 border-blue-500 text-blue-900';
      case 'booked': return 'bg-green-300 border-green-500 text-green-900';
      case 'pending': return 'bg-yellow-300 border-yellow-500 text-yellow-900';
      case 'cancelled': return 'bg-red-300 border-red-500 text-red-900';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Libero';
      case 'booked': return 'Occupato';
      case 'pending': return 'In attesa';
      case 'cancelled': return 'Annullato';
      default: return '';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  // Helper to toggle slot availability
  const toggleSlotAvailability = (barber: string, dayKey: string, time: string) => {
    setSchedule(prev => {
      const updated = prev[barber].map(day =>
        day.day === dayKey
          ? {
              ...day,
              unavailable: day.unavailable?.includes(time)
                ? day.unavailable.filter(t => t !== time)
                : [...(day.unavailable || []), time],
            }
          : day
      );
      return { ...prev, [barber]: updated };
    });
  };

  const barberSchedule = schedule[selectedBarber] || [];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-semibold ${tab === 'hours' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-500'}`}
          onClick={() => setTab('hours')}
        >
          Set Working Hours
        </button>
        <button
          className={`px-4 py-2 font-semibold ${tab === 'slots' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-500'}`}
          onClick={() => setTab('slots')}
        >
          Visual Slot View
        </button>
      </div>

      {/* Barber Toggle - always visible */}
      <div className="flex justify-start gap-4 mb-4">
        {barbers.map(barber => (
          <button
            key={barber.barber_id}
            className={`px-4 py-2 rounded-full font-semibold transition 
              ${selectedBarber === barber.name
                ? 'bg-blue-600 text-white shadow'
                : 'bg-salon-beige text-blue-800 border border-blue-300'}`}
            onClick={() => setSelectedBarber(barber.name)}
          >
            {barber.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'hours' && (
        <WeeklyHoursEditor
          selectedBarber={selectedBarber}
          schedule={schedule}
          setSchedule={setSchedule}
          barbers={barbers}
        />
      )}

      {tab === 'slots' && (
        <>
          {/* Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="font-playfair text-2xl text-salon-black flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-salon-gold" />
                  Calendario Prenotazioni
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-salon-black px-4 py-2 bg-salon-beige rounded-full">
                    {weekDays[0].toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })} - {weekDays[6].toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Legenda */}
              <div className="flex flex-wrap items-center gap-4 mt-4 p-4 bg-gradient-to-r from-salon-beige to-salon-white rounded-xl border">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-300 border border-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-salon-black">Libero</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-300 border border-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-salon-black">Occupato</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-300 border border-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-salon-black">In Attesa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-300 border border-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-salon-black">Annullato</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Working hours display for each day */}
          <div className="mb-4 flex items-center gap-2 text-salon-black text-sm font-semibold">
            <span>Orario di lavoro per</span>
            <span className={`px-2 py-1 rounded-full ${selectedBarber === 'Selim' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
              {selectedBarber}
            </span>
            <span>
              {/* Show working hours for today (first day of week) */}
              {(() => {
                const todayKey = days[weekDays[0].getDay() === 0 ? 6 : weekDays[0].getDay() - 1].key;
                const wh = barberSchedule.find(s => s.day === todayKey);
                return wh && wh.available ? `${wh.start} - ${wh.end}` : 'Non disponibile';
              })()}
            </span>
          </div>

          {/* Calendario principale */}
          <div className="grid grid-cols-1 xl:grid-cols-7 gap-3">
            {weekDays.map((day, dayIndex) => {
              // Map JS day (0=Sun) to our keys
              const jsDay = day.getDay();
              const dayKey = days[jsDay === 0 ? 6 : jsDay - 1].key;
              const barberDaySchedule = barberSchedule.find(s => s.day === dayKey);
              const workingHours = (barberDaySchedule && barberDaySchedule.available)
                ? generateTimeSlots(barberDaySchedule.start, barberDaySchedule.end)
                : [];
              return (
                <Card key={day.toISOString()} className={`${isToday(day) ? 'ring-2 ring-salon-gold shadow-lg' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="text-center">
                      <div className="text-sm font-medium text-salon-black/70 mb-1">
                        {dayNames[dayIndex]}
                      </div>
                      <div className={`text-lg font-bold ${isToday(day) ? 'text-salon-gold' : 'text-salon-black'}`}>{day.getDate()}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 px-2">
                    {/* Header con nomi barbieri */}
                    <div className="mb-3">
                      <div className="text-center">
                        <div className={`flex items-center justify-center gap-2 pb-1 border-b 
                          ${selectedBarber === 'Selim' ? 'border-blue-300' : 'border-purple-300'}`}>
                          <div className={`w-3 h-3 rounded-full 
                            ${selectedBarber === 'Selim' ? 'bg-blue-600' : 'bg-purple-600'}`}></div>
                          <span className={`text-sm font-semibold 
                            ${selectedBarber === 'Selim' ? 'text-blue-800' : 'text-purple-800'}`}>{selectedBarber}</span>
                        </div>
                      </div>
                    </div>
                    {/* Slot orari paralleli */}
                    <div className="space-y-2">
                      {workingHours.map((time) => {
                        const status = getSlotStatus(day, time, selectedBarber);
                        const booking = getBookingForSlot(day, time, selectedBarber);
                        const isUnavailable =
                          barberDaySchedule?.unavailable?.includes(time);

                        return (
                          <div key={time} className="mb-2">
                            <div
                              className={`p-2 rounded-lg border transition-all duration-200 min-h-[100px] w-full cursor-pointer
                                ${getSlotColor(status)}
                                ${isUnavailable ? 'bg-gray-200 border-gray-400 text-gray-500 opacity-60' : ''}
                              `}
                              onClick={() => {
                                if (status === 'available' && !booking) {
                                  toggleSlotAvailability(selectedBarber, dayKey, time);
                                }
                              }}
                            >
                              <div className="flex flex-col h-full justify-between">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold">{time}</span>
                                  {booking && (
                                    <User className="h-3 w-3 flex-shrink-0" />
                                  )}
                                </div>
                                {isUnavailable && (
                                  <div className="flex-1 flex items-center justify-center text-xs font-semibold text-gray-500">
                                    Non disponibile
                                  </div>
                                )}
                                {booking && (
                                  <div className="flex-1 space-y-1">
                                    <div className="text-xs font-semibold leading-tight break-all">{booking.name}</div>
                                    <div className="text-xs opacity-90 leading-tight break-all">{booking.service}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ModernCalendar;
