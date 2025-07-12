
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, User } from 'lucide-react';
import Dashboard from './Dashboard';

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    const success = await login(data.email, data.password);
    if (!success) {
      setError('Credenziali non valide. Riprova.');
    }
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-salon-beige via-salon-white to-salon-beige flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2 rounded-full">
              <ArrowLeft className="h-4 w-4" />
              Torna al sito
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-salon-gold to-yellow-500 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="font-playfair text-3xl font-bold text-salon-black">
              Accesso Riservato
            </CardTitle>
            <p className="text-salon-black/70 mt-2">
              Inserisci le tue credenziali per accedere
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-salon-black font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-salon-black/50" />
                          <Input 
                            {...field} 
                            type="email"
                            className="pl-10 rounded-full border-salon-gold/30 focus:border-salon-gold"
                            placeholder="Inserisci email"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-salon-black font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-salon-black/50" />
                          <Input 
                            {...field} 
                            type="password"
                            className="pl-10 rounded-full border-salon-gold/30 focus:border-salon-gold"
                            placeholder="Inserisci password"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-full">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-salon-gold to-yellow-500 hover:from-salon-gold/90 hover:to-yellow-500/90 text-white font-medium py-3 rounded-full text-lg shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Accedi...' : 'Accedi'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
