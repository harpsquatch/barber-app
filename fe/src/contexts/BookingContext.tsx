
import { createContext, useContext, useState, ReactNode } from 'react';

export interface Booking {
  id: number;
  name: string;
  email?: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  barber: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  updateBookingStatus: (id: number, status: 'confirmed' | 'cancelled') => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

const initialBookings: Booking[] = [
  {
    id: 1,
    name: "Marco Rossi",
    email: "marco.rossi@email.com",
    phone: "+39 333 123 4567",
    service: "Taglio + Barba",
    date: "2024-01-20",
    time: "10:00",
    status: "pending",
    notes: "Preferisce taglio corto",
    barber: "Selim"
  },
  {
    id: 2,
    name: "Giuseppe Bianchi",
    email: "g.bianchi@email.com",
    phone: "+39 347 987 6543",
    service: "Taglio completo",
    date: "2024-01-20",
    time: "14:30",
    status: "confirmed",
    notes: "",
    barber: "Daniel"
  },
  {
    id: 3,
    name: "Andrea Verdi",
    email: "andrea.v@email.com",
    phone: "+39 320 456 7890",
    service: "Barba completa",
    date: "2024-01-21",
    time: "09:15",
    status: "pending",
    notes: "Prima volta",
    barber: "Selim"
  },
  {
    id: 4,
    name: "Luca Neri",
    email: "luca.neri@email.com",
    phone: "+39 338 555 1234",
    service: "Taglio + Styling",
    date: "2024-01-20",
    time: "11:30",
    status: "confirmed",
    notes: "",
    barber: "Daniel"
  },
  {
    id: 5,
    name: "Francesco Gialli",
    email: "f.gialli@email.com",
    phone: "+39 345 678 9012",
    service: "Taglio + Barba",
    date: "2024-01-21",
    time: "15:00",
    status: "confirmed",
    notes: "Cliente abituale",
    barber: "Selim"
  },
  {
    id: 6,
    name: "Antonio Blu",
    email: "antonio.blu@email.com",
    phone: "+39 389 456 7123",
    service: "Shampoo + Taglio",
    date: "2024-01-22",
    time: "10:30",
    status: "pending",
    notes: "",
    barber: "Daniel"
  },
  {
    id: 7,
    name: "Stefano Viola",
    email: "s.viola@email.com",
    phone: "+39 366 789 0123",
    service: "Barba + Styling",
    date: "2024-01-22",
    time: "16:45",
    status: "confirmed",
    notes: "Evento speciale",
    barber: "Selim"
  }
];

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const addBooking = (newBooking: Omit<Booking, 'id' | 'status'>) => {
    const booking: Booking = {
      ...newBooking,
      id: Math.max(...bookings.map(b => b.id), 0) + 1,
      status: 'pending'
    };
    setBookings(prev => [...prev, booking]);
  };

  const updateBookingStatus = (id: number, status: 'confirmed' | 'cancelled') => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
};
