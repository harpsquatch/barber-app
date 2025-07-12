import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModernCalendar from '@/components/ModernCalendar';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Booking as ContextBooking } from '@/contexts/BookingContext';

interface Booking {
  id: number;
  name: string;
  email?: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  barber_id?: number;
  status: string;
  created_at: string;
}

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch bookings from database
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('id, name, email, phone, service, date, time, barber_id, status, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          toast({
            title: "Errore",
            description: "Impossibile caricare le prenotazioni.",
            variant: "destructive"
          });
          return;
        }

        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le prenotazioni.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    // Update booking status in database
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato della prenotazione.",
        variant: "destructive"
      });
      return;
    }

    // Update local state
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));

    toast({
      title: "Stato aggiornato",
      description: `Prenotazione ${newStatus === 'confirmed' ? 'confermata' : 'annullata'} con successo.`
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confermata';
      case 'cancelled': return 'Annullata';
      default: return 'In attesa';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-salon-beige via-salon-white to-salon-beige">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-salon-black mb-2">
                Calendario
              </h1>
              <p className="text-salon-black/70">
                Gestione prenotazioni e calendario
              </p>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline" 
              className="flex items-center gap-2 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna alla Dashboard
            </Button>
          </div>

          {/* Cards statistiche */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Prenotazioni Oggi</CardTitle>
                <Calendar className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">
                  {bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">In Attesa</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Confermate</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendario moderno */}
          <div className="mb-8">
            <ModernCalendar bookings={bookings.map(booking => ({
              ...booking,
              barber: booking.barber_id ? `Barber ${booking.barber_id}` : 'Unknown',
              status: booking.status as 'confirmed' | 'cancelled' | 'pending'
            }))} />
          </div>

          {/* Tabella prenotazioni */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-salon-gold/10 to-salon-gold/5">
              <CardTitle className="font-playfair text-2xl text-salon-black">
                Tutte le Prenotazioni
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-salon-beige/50">
                      <TableHead className="font-semibold">Cliente</TableHead>
                      <TableHead className="font-semibold">Servizio</TableHead>
                      <TableHead className="font-semibold">Data & Ora</TableHead>
                      <TableHead className="font-semibold">Contatti</TableHead>
                      <TableHead className="font-semibold">Stato</TableHead>
                      <TableHead className="font-semibold">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-salon-beige/20 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-salon-gold/20 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-salon-gold" />
                            </div>
                            <div>
                              <div className="font-medium text-salon-black">
                                {booking.name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-salon-black font-medium">
                          {booking.service}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-salon-black">
                              <Calendar className="h-4 w-4 text-salon-gold" />
                              {new Date(booking.date).toLocaleDateString('it-IT')}
                            </div>
                            <div className="flex items-center gap-2 text-salon-black">
                              <Clock className="h-4 w-4 text-salon-gold" />
                              {booking.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-salon-black/70">
                              <Phone className="h-3 w-3" />
                              {booking.phone}
                            </div>
                            {booking.email && (
                              <div className="flex items-center gap-2 text-sm text-salon-black/70">
                                <Mail className="h-3 w-3" />
                                {booking.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(booking.status)} rounded-full px-3 py-1`}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  className="bg-green-600 hover:bg-green-700 rounded-full"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  className="rounded-full"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
