import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Shield, Users, Mail, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase, signUp, signIn, isSupabaseConfigured } from '@/lib/supabase';
import { useFormValidation, commonValidationRules, ValidationSchema } from '@/hooks/useFormValidation';
import { useLanguage, t } from '@/lib/i18n';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const { toast } = useToast();
  const { language } = useLanguage();

  // Validation schemas
  const signInSchema: ValidationSchema = {
    email: commonValidationRules.email,
    password: { required: true, minLength: 1 }
  };

  const signUpSchema: ValidationSchema = {
    email: commonValidationRules.email,
    password: commonValidationRules.password,
    confirmPassword: { required: true },
    fullName: commonValidationRules.fullName,
    username: commonValidationRules.username,
    school: commonValidationRules.school,
    level: { required: true }
  };

  const signInValidation = useFormValidation(signInSchema);
  const signUpValidation = useFormValidation(signUpSchema);

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
    school: '',
    level: '',
    field: '',
    graduationYear: new Date().getFullYear(),
    classYear: '',
    studentId: '',
    isMinor: false,
    parentEmail: '',
    acceptTerms: false
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    signInValidation.clearErrors();
    
    // Validate form
    if (!signInValidation.validateForm(signInData)) {
      toast({
        title: t('error', language),
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isSupabaseConfigured()) {
      toast({
        title: "Configuration requise",
        description: "Supabase doit être configuré pour l'authentification.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        // Handle specific authentication errors
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Trop de tentatives. Veuillez réessayer dans quelques minutes.";
        }
        
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Connexion réussie!",
        description: "Bienvenue sur StudentGram!"
      });

      // Reset form
      setSignInData({ email: '', password: '' });
      signInValidation.clearErrors();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      let errorMessage = "Une erreur inattendue s'est produite.";
      
      if (error?.code === 'NETWORK_ERROR') {
        errorMessage = "Problème de connexion. Vérifiez votre internet.";
      } else if (error?.code === 'TIMEOUT') {
        errorMessage = "La connexion a pris trop de temps. Réessayez.";
      }
      
      toast({
        title: t('error', language),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    signUpValidation.clearErrors();
    
    // Validate form
    if (!signUpValidation.validateForm(signUpData)) {
      toast({
        title: t('error', language),
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive"
      });
      return;
    }

    // Additional validations
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: t('error', language),
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }

    if (!signUpData.acceptTerms) {
      toast({
        title: t('error', language),
        description: "Vous devez accepter les conditions d'utilisation.",
        variant: "destructive"
      });
      return;
    }

    if (signUpData.isMinor && !signUpData.parentEmail) {
      toast({
        title: "Email parental requis",
        description: "L'email d'un parent est obligatoire pour les mineurs.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { success, error } = await signUp(signUpData.email, signUpData.password, signUpData);
      
      if (!success) {
        toast({
          title: "Erreur d'inscription",
          description: error || "Une erreur s'est produite lors de l'inscription.",
          variant: "destructive"
        });
        return;
      }

      // Reset form
      setSignUpData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        username: '',
        school: '',
        level: '',
        field: '',
        graduationYear: new Date().getFullYear(),
        classYear: '',
        studentId: '',
        isMinor: false,
        parentEmail: '',
        acceptTerms: false
      });
      signUpValidation.clearErrors();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: t('error', language),
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-gradient-to-br from-pink-50 to-orange-50 border-0 shadow-2xl">
        <DialogHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{background: 'var(--gradient-primary)'}}>
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              StudentGram
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              Le réseau social des étudiants belges
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Rejoins la communauté étudiante</h2>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">Connexion</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">Inscription</TabsTrigger>
            </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Se connecter</CardTitle>
                <CardDescription>
                  Connecte-toi avec ton compte étudiant vérifié
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email étudiant</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="ton.email@ecole.be"
                      value={signInData.email}
                      onChange={(e) => {
                        setSignInData(prev => ({ ...prev, email: e.target.value }));
                        signInValidation.clearFieldError('email');
                      }}
                      onBlur={() => signInValidation.validateSingleField('email', signInData.email)}
                      className={signInValidation.errors.email ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {signInValidation.errors.email && (
                      <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{signInValidation.errors.email}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Mot de passe</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => {
                        setSignInData(prev => ({ ...prev, password: e.target.value }));
                        signInValidation.clearFieldError('password');
                      }}
                      onBlur={() => signInValidation.validateSingleField('password', signInData.password)}
                      className={signInValidation.errors.password ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {signInValidation.errors.password && (
                      <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{signInValidation.errors.password}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6 font-semibold text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" 
                    style={{background: 'var(--gradient-primary)'}}
                    disabled={loading}
                  >
                    {loading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Badge variant="outline" className="badge-secondary text-center">
                <Users className="h-3 w-3 mr-1" />
                Secondaire
              </Badge>
              <Badge variant="outline" className="badge-higher text-center">
                <GraduationCap className="h-3 w-3 mr-1" />
                Supérieur
              </Badge>
              <Badge variant="outline" className="badge-university text-center">
                <Shield className="h-3 w-3 mr-1" />
                Université
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Créer un compte étudiant</CardTitle>
                <CardDescription>
                  Rejoins la communauté étudiante belge sécurisée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input
                        id="fullName"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input
                        id="username"
                        value={signUpData.username}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email étudiant</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ton.email@ecole.be"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmer</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Academic Info */}
                  <div>
                    <Label htmlFor="school">Établissement scolaire</Label>
                    <Input
                      id="school"
                      placeholder="Nom de ton école/université"
                      value={signUpData.school}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, school: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="level">Niveau d'études</Label>
                      <Select 
                        value={signUpData.level} 
                        onValueChange={(value) => setSignUpData(prev => ({ ...prev, level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="secondary">Secondaire</SelectItem>
                          <SelectItem value="higher">Supérieur</SelectItem>
                          <SelectItem value="university">Université</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="field">Filière/Domaine</Label>
                      <Input
                        id="field"
                        placeholder="Ex: Sciences, Informatique"
                        value={signUpData.field}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, field: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="classYear">Année/Classe</Label>
                      <Input
                        id="classYear"
                        placeholder="Ex: 5ème, L3, M1"
                        value={signUpData.classYear}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, classYear: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="graduationYear">Année diplôme</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        min="2020"
                        max="2035"
                        value={signUpData.graduationYear}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, graduationYear: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="studentId">Numéro étudiant (optionnel)</Label>
                    <Input
                      id="studentId"
                      placeholder="Ton numéro d'étudiant"
                      value={signUpData.studentId}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, studentId: e.target.value }))}
                    />
                  </div>

                  {/* Minor Protection */}
                  <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isMinor"
                        checked={signUpData.isMinor}
                        onCheckedChange={(checked) => 
                          setSignUpData(prev => ({ ...prev, isMinor: checked as boolean }))
                        }
                      />
                      <Label htmlFor="isMinor" className="text-sm">
                        <Shield className="h-4 w-4 inline mr-1" />
                        J'ai moins de 18 ans (protections renforcées)
                      </Label>
                    </div>

                    {signUpData.isMinor && (
                      <div>
                        <Label htmlFor="parentEmail" className="text-sm">
                          <Mail className="h-4 w-4 inline mr-1" />
                          Email du parent/tuteur (requis)
                        </Label>
                        <Input
                          id="parentEmail"
                          type="email"
                          placeholder="parent@email.com"
                          value={signUpData.parentEmail}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, parentEmail: e.target.value }))}
                          required={signUpData.isMinor}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Ton parent recevra des notifications de sécurité
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={signUpData.acceptTerms}
                      onCheckedChange={(checked) => 
                        setSignUpData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                      }
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      J'accepte les conditions d'utilisation et la politique de confidentialité
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6 font-semibold text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" 
                    style={{background: 'var(--gradient-primary)'}}
                    disabled={loading || !signUpData.acceptTerms}
                  >
                    {loading ? "Création du compte..." : "Créer mon compte étudiant"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;