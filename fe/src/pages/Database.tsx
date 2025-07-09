
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Users, MessageSquare, Search, Mail, Phone, Calendar, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookings } from '@/contexts/BookingContext';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  totalBookings: number;
  lastBooking: string;
  services: string[];
  status: 'active' | 'inactive';
}

const DatabasePage = () => {
  const { bookings } = useBookings();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'sms' | 'email'>('sms');

  // Estrae i clienti dalle prenotazioni
  useEffect(() => {
    const clientsMap = new Map<string, Client>();
    
    bookings.forEach(booking => {
      const clientKey = `${booking.name.toLowerCase()}_${booking.phone}`;
      
      if (clientsMap.has(clientKey)) {
        const existingClient = clientsMap.get(clientKey)!;
        existingClient.totalBookings += 1;
        existingClient.services = [...new Set([...existingClient.services, booking.service])];
        if (new Date(booking.date) > new Date(existingClient.lastBooking)) {
          existingClient.lastBooking = booking.date;
        }
      } else {
        clientsMap.set(clientKey, {
          id: clientKey,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          totalBookings: 1,
          lastBooking: booking.date,
          services: [booking.service],
          status: 'active'
        });
      }
    });

    setClients(Array.from(clientsMap.values()));
  }, [bookings]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const selectAllClients = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(client => client.id));
    }
  };

  const sendMassiveMessage = () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Errore",
        description: "Seleziona almeno un cliente per inviare il messaggio.",
        variant: "destructive"
      });
      return;
    }

    if (!messageText.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci il testo del messaggio.",
        variant: "destructive"
      });
      return;
    }

    // Simula l'invio del messaggio
    const selectedClientNames = clients
      .filter(client => selectedClients.includes(client.id))
      .map(client => client.name);

    console.log(`Invio ${messageType.toUpperCase()} a:`, selectedClientNames);
    console.log('Messaggio:', messageText);

    toast({
      title: "Messaggi Inviati!",
      description: `${messageType.toUpperCase()} inviato a ${selectedClients.length} clienti.`
    });

    // Reset
    setSelectedClients([]);
    setMessageText('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-salon-beige via-salon-white to-salon-beige">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="font-playfair text-4xl font-bold text-salon-black mb-2 flex items-center gap-3">
                  <Database className="h-10 w-10 text-salon-gold" />
                  Database Clienti
                </h1>
                <p className="text-salon-black/70">
                  Gestisci i tuoi clienti e invia messaggi massivi
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-600 text-sm font-medium">Totale Clienti</p>
                  <p className="text-2xl font-bold text-blue-800">{clients.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-green-600 text-sm font-medium">Prenotazioni Totali</p>
                  <p className="text-2xl font-bold text-green-800">{bookings.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-600 text-sm font-medium">Clienti Selezionati</p>
                  <p className="text-2xl font-bold text-purple-800">{selectedClients.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Tabella Clienti */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="h-5 w-5 text-salon-gold" />
                      Lista Clienti
                    </span>
                    <Button
                      onClick={selectAllClients}
                      variant="outline"
                      size="sm"
                    >
                      {selectedClients.length === filteredClients.length ? 'Deseleziona Tutti' : 'Seleziona Tutti'}
                    </Button>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cerca per nome, telefono o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Sel.</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Contatti</TableHead>
                          <TableHead>Prenotazioni</TableHead>
                          <TableHead>Ultimo Appuntamento</TableHead>
                          <TableHead>Servizi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedClients.includes(client.id)}
                                onChange={() => toggleClientSelection(client.id)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-3 w-3" />
                                  {client.phone}
                                </div>
                                {client.email && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Mail className="h-3 w-3" />
                                    {client.email}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{client.totalBookings}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(client.lastBooking)}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {client.services.slice(0, 2).map((service, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                                {client.services.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{client.services.length - 2}
                                  </Badge>
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

            {/* Pannello Messaggi Massivi */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-salon-gold" />
                    Messaggi Massivi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tipo di Messaggio
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant={messageType === 'sms' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMessageType('sms')}
                        className="flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" />
                        SMS
                      </Button>
                      <Button
                        variant={messageType === 'email' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMessageType('email')}
                        className="flex items-center gap-1"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Messaggio
                    </label>
                    <Textarea
                      placeholder={`Scrivi il tuo messaggio ${messageType.toUpperCase()} qui...`}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {messageText.length}/160 caratteri
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Clienti selezionati:</strong> {selectedClients.length}
                    </p>
                    {selectedClients.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {clients
                          .filter(client => selectedClients.includes(client.id))
                          .slice(0, 3)
                          .map(client => client.name)
                          .join(', ')}
                        {selectedClients.length > 3 && ` e altri ${selectedClients.length - 3}...`}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={sendMassiveMessage}
                    className="w-full bg-salon-gold hover:bg-salon-gold/90 text-white"
                    size="lg"
                  >
                    Invia Messaggio Massivo
                  </Button>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Nota:</strong> I messaggi SMS vengono inviati solo ai clienti con numero di telefono.</p>
                    <p>Le email vengono inviate solo ai clienti con indirizzo email.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabasePage;
