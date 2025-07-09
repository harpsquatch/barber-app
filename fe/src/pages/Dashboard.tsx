import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Settings, Database, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-salon-beige via-salon-white to-salon-beige">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-salon-black mb-2">
                Dashboard
              </h1>
              <p className="text-salon-black/70">
                Benvenuto nell'area riservata di SellBarbers
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="flex items-center gap-2 rounded-full hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Esci
            </Button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Calendario */}
            <Link to="/manage-bookings">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="font-playfair text-2xl font-bold text-blue-800">
                    Calendario
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-blue-700 mb-4">
                    Gestisci prenotazioni e visualizza il calendario settimanale
                  </p>
                  <div className="text-sm text-blue-600 font-medium">
                    Clicca per accedere →
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Impostazioni */}
            <Link to="/settings">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Settings className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="font-playfair text-2xl font-bold text-purple-800">
                    Impostazioni
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-purple-700 mb-4">
                    Configura orari, servizi e preferenze del salone
                  </p>
                  <div className="text-sm text-purple-600 font-medium">
                    Clicca per accedere →
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Database */}
            <Link to="/database">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Database className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="font-playfair text-2xl font-bold text-green-800">
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-green-700 mb-4">
                    Gestisci clienti, storico e statistiche del salone
                  </p>
                  <div className="text-sm text-green-600 font-medium">
                    Clicca per accedere →
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Info Card */}
          <Card className="mt-8 bg-gradient-to-r from-salon-gold/10 to-yellow-100 border-salon-gold/30">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 bg-salon-gold/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-salon-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-salon-black">Sessione Attiva</h3>
                <p className="text-salon-black/70 text-sm">
                  Sei connesso come amministratore. Ricorda di uscire quando hai finito.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
