import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Globe, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useLanguage, t, Language } from '@/lib/i18n';

interface SettingsPageProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
    email?: string;
    bio?: string;
    school?: string;
    field?: string;
  };
  onSignOut?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onSignOut }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'language' | 'help'>('profile');
  const { language, setLanguage } = useLanguage();
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || 'Kevin Vandamme',
    username: currentUser?.username || 'kevin_vandamme',
    email: currentUser?.email || 'kevin.vandamme@student.ulb.be',
    bio: currentUser?.bio || 'Étudiant en Informatique à l\'ULB',
    school: currentUser?.school || 'Université Libre de Bruxelles',
    field: currentUser?.field || 'Master en Sciences Informatiques'
  });

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    email: false,
    push: true
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showSchool: true,
    allowMessages: true,
    allowTags: true
  });

  const sections = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'language', label: 'Langue', icon: Globe },
    { id: 'help', label: 'Aide', icon: HelpCircle }
  ];

  const handleProfileUpdate = () => {
    // Ici on ajouterait la logique pour mettre à jour le profil
    console.log('Updating profile:', profileData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4">
            <nav className="space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border p-6">
            
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Informations du profil</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={currentUser?.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white text-2xl">
                      {profileData.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Changer la photo
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG ou GIF. Max 5MB.
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <Input
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d'utilisateur
                    </label>
                    <Input
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Établissement
                    </label>
                    <Input
                      value={profileData.school}
                      onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filière d'études
                    </label>
                    <Input
                      value={profileData.field}
                      onChange={(e) => setProfileData({...profileData, field: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleProfileUpdate}
                  className="text-white"
                  style={{background: 'var(--gradient-primary)'}}
                >
                  Sauvegarder les modifications
                </Button>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Préférences de notification</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Likes sur mes posts</p>
                      <p className="text-sm text-gray-500">Recevoir une notification quand quelqu'un aime mes posts</p>
                    </div>
                    <Switch 
                      checked={notifications.likes}
                      onCheckedChange={(checked) => setNotifications({...notifications, likes: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Commentaires</p>
                      <p className="text-sm text-gray-500">Recevoir une notification pour les nouveaux commentaires</p>
                    </div>
                    <Switch 
                      checked={notifications.comments}
                      onCheckedChange={(checked) => setNotifications({...notifications, comments: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nouveaux abonnés</p>
                      <p className="text-sm text-gray-500">Recevoir une notification quand quelqu'un me suit</p>
                    </div>
                    <Switch 
                      checked={notifications.follows}
                      onCheckedChange={(checked) => setNotifications({...notifications, follows: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mentions</p>
                      <p className="text-sm text-gray-500">Recevoir une notification quand je suis mentionné</p>
                    </div>
                    <Switch 
                      checked={notifications.mentions}
                      onCheckedChange={(checked) => setNotifications({...notifications, mentions: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages privés</p>
                      <p className="text-sm text-gray-500">Recevoir une notification pour les nouveaux messages</p>
                    </div>
                    <Switch 
                      checked={notifications.messages}
                      onCheckedChange={(checked) => setNotifications({...notifications, messages: checked})}
                    />
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications par email</p>
                      <p className="text-sm text-gray-500">Recevoir un résumé hebdomadaire par email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications push</p>
                      <p className="text-sm text-gray-500">Recevoir des notifications sur votre appareil</p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Confidentialité et sécurité</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profil public</p>
                      <p className="text-sm text-gray-500">Permettre à tous les étudiants de voir votre profil</p>
                    </div>
                    <Switch 
                      checked={privacy.profilePublic}
                      onCheckedChange={(checked) => setPrivacy({...privacy, profilePublic: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Afficher l'email</p>
                      <p className="text-sm text-gray-500">Rendre votre adresse email visible sur votre profil</p>
                    </div>
                    <Switch 
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Afficher l'établissement</p>
                      <p className="text-sm text-gray-500">Montrer votre école sur votre profil</p>
                    </div>
                    <Switch 
                      checked={privacy.showSchool}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showSchool: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autoriser les messages</p>
                      <p className="text-sm text-gray-500">Permettre aux autres étudiants de vous envoyer des messages</p>
                    </div>
                    <Switch 
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autoriser les mentions</p>
                      <p className="text-sm text-gray-500">Permettre aux autres de vous mentionner dans leurs posts</p>
                    </div>
                    <Switch 
                      checked={privacy.allowTags}
                      onCheckedChange={(checked) => setPrivacy({...privacy, allowTags: checked})}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Actions de sécurité</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline" size="sm">
                      Télécharger mes données
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Supprimer mon compte
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections with placeholder content */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Apparence</h2>
                <p className="text-gray-600">Personnalisez l'apparence de StudentGram selon vos préférences.</p>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Thème</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Clair</Button>
                      <Button variant="outline" size="sm">Sombre</Button>
                      <Button variant="outline" size="sm">Automatique</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'language' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Langue et région</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue de l'interface
                    </label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      title="Sélectionner la langue de l'interface"
                    >
                      <option value="fr">Français</option>
                      <option value="nl">Nederlands</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'help' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Aide et support</h2>
                <div className="space-y-4">
                  <Button variant="outline" className="justify-start w-full">
                    Centre d'aide
                  </Button>
                  <Button variant="outline" className="justify-start w-full">
                    Contacter le support
                  </Button>
                  <Button variant="outline" className="justify-start w-full">
                    Signaler un problème
                  </Button>
                  <Button variant="outline" className="justify-start w-full">
                    Conditions d'utilisation
                  </Button>
                  <Button variant="outline" className="justify-start w-full">
                    Politique de confidentialité
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Zone de danger</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Se déconnecter</p>
            <p className="text-sm text-gray-500">Vous déconnecter de votre compte StudentGram</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
