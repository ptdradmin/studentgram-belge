import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginFormProps {
  onClose?: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        toast({
          title: "Connexion réussie",
          description: "Redirection vers le panneau d'administration...",
        });
        
        // Close modal if provided
        if (onClose) {
          onClose();
        }
        
        // Navigate to admin panel
        navigate('/admin');
      } else {
        toast({
          title: "Erreur de connexion",
          description: result.error || "Identifiants incorrects.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@studentgrambelge.com');
    setPassword('AdminStudent2024@');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Connexion Administrateur</CardTitle>
        <p className="text-sm text-muted-foreground">
          Accès réservé aux administrateurs de StudentGram
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email administrateur</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@studentgrambelge.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Demo credentials helper */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Identifiants de démonstration :</strong>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillAdminCredentials}
              disabled={loading}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              Utiliser les identifiants admin
            </Button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Se connecter
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Seuls les administrateurs autorisés peuvent accéder à cette interface.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
