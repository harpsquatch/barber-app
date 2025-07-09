
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Scissors } from 'lucide-react';
import { Booking } from '@/contexts/BookingContext';

interface WeeklyCalendarProps {
  bookings: Booking[];
}

const WeeklyCalendar = ({ bookings }: WeeklyCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lunedì come primo giorno
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

  const getBookingsForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === dateString);
  };

  const getBookingsForBarber = (dayBookings: Booking[], barber: string) => {
    return dayBookings.filter(booking => booking.barber === barber);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getBarberColor = (barber: string) => {
    return barber === 'Selim' ? 'border-l-blue-500' : 'border-l-purple-500';
  };

  const getEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = minutes === 30 ? hours + 1 : hours;
    const endMinute = minutes === 30 ? 0 : minutes + 30;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-playfair text-2xl text-salon-black flex items-center gap-2">
            <Calendar className="h-6 w-6 text-salon-gold" />
            Calendario Settimanale
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-salon-black px-4">
              {weekDays[0].toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })} - {weekDays[6].toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Legenda Barber */}
        <div className="flex items-center gap-6 mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-salon-black">Selim</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-salon-black">Daniel</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayBookings = getBookingsForDay(day);
            const selimBookings = getBookingsForBarber(dayBookings, 'Selim');
            const danielBookings = getBookingsForBarber(dayBookings, 'Daniel');
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={day.toISOString()}
                className={`border rounded-lg p-3 min-h-[400px] ${
                  isToday ? 'border-salon-gold bg-salon-gold/5' : 'border-gray-200'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-salon-black">
                    {dayNames[index]}
                  </div>
                  <div className={`text-lg font-bold ${
                    isToday ? 'text-salon-gold' : 'text-salon-black'
                  }`}>
                    {day.getDate()}
                  </div>
                </div>
                
                {/* Sezione Selim */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-blue-200">
                    <Scissors className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-700">Selim</span>
                  </div>
                  <div className="space-y-2">
                    {selimBookings.length === 0 ? (
                      <div className="text-xs text-gray-400 text-center py-2">
                        Libero
                      </div>
                    ) : (
                      selimBookings
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((booking) => (
                          <div
                            key={booking.id}
                            className={`bg-white border-l-4 ${getBarberColor(booking.barber)} border border-gray-100 rounded p-2 shadow-sm hover:shadow-md transition-shadow`}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3 text-salon-gold" />
                              <span className="text-xs font-medium text-salon-black">
                                {booking.time} - {getEndTime(booking.time)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              <User className="h-3 w-3 text-salon-gold" />
                              <span className="text-xs text-salon-black truncate">
                                {booking.name}
                              </span>
                            </div>
                            <div className="text-xs text-salon-black/70 mb-2 truncate">
                              {booking.service}
                            </div>
                            <Badge 
                              className={`text-xs ${getStatusColor(booking.status)}`}
                            >
                              {booking.status === 'confirmed' ? 'Confermata' : 
                               booking.status === 'cancelled' ? 'Annullata' : 'In attesa'}
                            </Badge>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Sezione Daniel */}
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-purple-200">
                    <Scissors className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-semibold text-purple-700">Daniel</span>
                  </div>
                  <div className="space-y-2">
                    {danielBookings.length === 0 ? (
                      <div className="text-xs text-gray-400 text-center py-2">
                        Libero
                      </div>
                    ) : (
                      danielBookings
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((booking) => (
                          <div
                            key={booking.id}
                            className={`bg-white border-l-4 ${getBarberColor(booking.barber)} border border-gray-100 rounded p-2 shadow-sm hover:shadow-md transition-shadow`}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3 text-salon-gold" />
                              <span className="text-xs font-medium text-salon-black">
                                {booking.time} - {getEndTime(booking.time)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              <User className="h-3 w-3 text-salon-gold" />
                              <span className="text-xs text-salon-black truncate">
                                {booking.name}
                              </span>
                            </div>
                            <div className="text-xs text-salon-black/70 mb-2 truncate">
                              {booking.service}
                            </div>
                            <Badge 
                              className={`text-xs ${getStatusColor(booking.status)}`}
                            >
                              {booking.status === 'confirmed' ? 'Confermata' : 
                               booking.status === 'cancelled' ? 'Annullata' : 'In attesa'}
                            </Badge>
                          </div>
                        ))
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
};

export default WeeklyCalendar;
