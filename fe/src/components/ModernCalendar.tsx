import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import { Booking } from '@/contexts/BookingContext';

interface ModernCalendarProps {
  bookings: Booking[];
}

const ModernCalendar = ({ bookings }: ModernCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Orari di lavoro (9:00 - 18:00)
  const workingHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

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

  return (
    <div className="w-full">
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

      {/* Calendario principale */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-3">
        {weekDays.map((day, dayIndex) => (
          <Card key={day.toISOString()} className={`${isToday(day) ? 'ring-2 ring-salon-gold shadow-lg' : ''}`}>
            <CardHeader className="pb-2">
              <div className="text-center">
                <div className="text-sm font-medium text-salon-black/70 mb-1">
                  {dayNames[dayIndex]}
                </div>
                <div className={`text-lg font-bold ${isToday(day) ? 'text-salon-gold' : 'text-salon-black'}`}>
                  {day.getDate()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-2">
              {/* Header con nomi barbieri */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 pb-1 border-b border-blue-300">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-semibold text-blue-800">Selim</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 pb-1 border-b border-purple-300">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span className="text-sm font-semibold text-purple-800">Daniel</span>
                  </div>
                </div>
              </div>

              {/* Slot orari paralleli */}
              <div className="space-y-2">
                {workingHours.map((time) => {
                  const selimStatus = getSlotStatus(day, time, 'Selim');
                  const selimBooking = getBookingForSlot(day, time, 'Selim');
                  const danielStatus = getSlotStatus(day, time, 'Daniel');
                  const danielBooking = getBookingForSlot(day, time, 'Daniel');
                  
                  return (
                    <div key={time} className="grid grid-cols-2 gap-2">
                      {/* Selim */}
                      <div className={`p-2 rounded-lg border transition-all duration-200 min-h-[100px] w-full ${getSlotColor(selimStatus)}`}>
                        <div className="flex flex-col h-full justify-between">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">{time}</span>
                            {selimBooking && (
                              <User className="h-3 w-3 flex-shrink-0" />
                            )}
                          </div>
                          {selimBooking && (
                            <div className="flex-1 space-y-1">
                              <div className="text-xs font-semibold leading-tight break-all">
                                {selimBooking.name}
                              </div>
                              <div className="text-xs opacity-90 leading-tight break-all">
                                {selimBooking.service}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Daniel */}
                      <div className={`p-2 rounded-lg border transition-all duration-200 min-h-[100px] w-full ${getSlotColor(danielStatus)}`}>
                        <div className="flex flex-col h-full justify-between">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">{time}</span>
                            {danielBooking && (
                              <User className="h-3 w-3 flex-shrink-0" />
                            )}
                          </div>
                          {danielBooking && (
                            <div className="flex-1 space-y-1">
                              <div className="text-xs font-semibold leading-tight break-all">
                                {danielBooking.name}
                              </div>
                              <div className="text-xs opacity-90 leading-tight break-all">
                                {danielBooking.service}
                              </div>
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
        ))}
      </div>
    </div>
  );
};

export default ModernCalendar;
