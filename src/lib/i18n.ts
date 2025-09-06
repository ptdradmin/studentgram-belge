import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'nl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage } },
    children
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    search: 'Rechercher',
    explore: 'Explorer',
    notifications: 'Notifications',
    messages: 'Messages',
    saved: 'Enregistrés',
    profile: 'Profil',
    settings: 'Paramètres',
    
    // Common actions
    like: 'J\'aime',
    comment: 'Commenter',
    share: 'Partager',
    save: 'Sauvegarder',
    edit: 'Modifier',
    delete: 'Supprimer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    
    // Profile
    posts: 'Publications',
    followers: 'Abonnés',
    following: 'Abonnements',
    about: 'À propos',
    photos: 'Photos',
    editProfile: 'Modifier le profil',
    
    // Settings
    profileSettings: 'Profil',
    notificationSettings: 'Notifications',
    privacy: 'Confidentialité',
    appearance: 'Apparence',
    language: 'Langue',
    help: 'Aide',
    
    // Messages
    writeComment: 'Écrire votre commentaire:',
    commentAdded: 'Commentaire ajouté!',
    linkCopied: 'Lien copié!',
    postSaved: 'Post sauvegardé!',
    failed_to_load_conversations: 'Échec du chargement des conversations',
    failed_to_load_messages: 'Échec du chargement des messages',
    success: 'Succès',
    message_sent: 'Message envoyé',
    failed_to_send_message: 'Échec de l\'envoi du message',
    active_now: 'Actif maintenant',
    active_minutes_ago: 'Actif il y a {count} minutes',
    active_hours_ago: 'Actif il y a {count} heures',
    active_days_ago: 'Actif il y a {count} jours',
    search_conversations: 'Rechercher des conversations',
    no_messages: 'Aucun message pour le moment',
    online: 'En ligne',
    offline: 'Hors ligne',
    type_message: 'Tapez un message',
    select_conversation: 'Sélectionner une conversation',
    choose_conversation_to_start: 'Choisissez une conversation pour commencer à discuter',
    
    // Notifications
    unread: 'non lues',
    markAllRead: 'Tout marquer comme lu',
    all: 'Toutes',
    
    // Search
    searchPlaceholder: 'Rechercher des étudiants, posts, hashtags...',
    users: 'Utilisateurs',
    hashtags: 'Hashtags',
    schools: 'Écoles',
    
    // Post creation
    whatsNew: 'Quoi de neuf dans vos études ?',
    createPost: 'Créer un Post',
    publish: 'Publier',
    
    // Landing page
    tagline: 'Le réseau étudiant sécurisé pour la Belgique',
    description: 'Connecte-toi avec des étudiants de toute la Belgique. Partage tes réussites, trouve de l\'aide, construis ton réseau académique.',
    joinStudentGram: 'Rejoindre StudentGram',
    freeForStudents: 'Gratuit pour tous les étudiants belges',
    
    // Auth messages
    goodbye: 'À bientôt!',
    signedOut: 'Tu es déconnecté de StudentGram.',
    error: 'Erreur',
    
    // Loading messages
    verifying_authentication: 'Vérification de l\'authentification...',
    loading_page: 'Chargement de la page...',
    loading: 'Chargement...'
  },
  
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    explore: 'Explore',
    notifications: 'Notifications',
    messages: 'Messages',
    saved: 'Saved',
    profile: 'Profile',
    settings: 'Settings',
    
    // Common actions
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    
    // Profile
    posts: 'Posts',
    followers: 'Followers',
    following: 'Following',
    about: 'About',
    photos: 'Photos',
    editProfile: 'Edit Profile',
    
    // Settings
    profileSettings: 'Profile',
    notificationSettings: 'Notifications',
    privacy: 'Privacy',
    appearance: 'Appearance',
    language: 'Language',
    help: 'Help',
    
    // Messages
    writeComment: 'Write your comment:',
    commentAdded: 'Comment added!',
    linkCopied: 'Link copied!',
    postSaved: 'Post saved!',
    failed_to_load_conversations: 'Failed to load conversations',
    failed_to_load_messages: 'Failed to load messages',
    success: 'Success',
    message_sent: 'Message sent',
    failed_to_send_message: 'Failed to send message',
    active_now: 'Active now',
    active_minutes_ago: 'Active {count} minutes ago',
    active_hours_ago: 'Active {count} hours ago', 
    active_days_ago: 'Active {count} days ago',
    search_conversations: 'Search conversations',
    no_messages: 'No messages yet',
    online: 'Online',
    offline: 'Offline',
    type_message: 'Type a message',
    select_conversation: 'Select a conversation',
    choose_conversation_to_start: 'Choose a conversation to start messaging',
    
    // Notifications
    unread: 'unread',
    markAllRead: 'Mark all as read',
    all: 'All',
    
    // Search
    searchPlaceholder: 'Search students, posts, hashtags...',
    users: 'Users',
    hashtags: 'Hashtags',
    schools: 'Schools',
    
    // Post creation
    whatsNew: 'What\'s new in your studies?',
    createPost: 'Create Post',
    publish: 'Publish',
    
    // Landing page
    tagline: 'The secure student network for Belgium',
    description: 'Connect with students from all over Belgium. Share your successes, find help, build your academic network.',
    joinStudentGram: 'Join StudentGram',
    freeForStudents: 'Free for all Belgian students',
    
    // Auth messages
    goodbye: 'See you soon!',
    signedOut: 'You are signed out of StudentGram.',
    error: 'Error',
    
    // Loading messages
    verifying_authentication: 'Verifying authentication...',
    loading_page: 'Loading page...',
    loading: 'Loading...'
  },
  
  nl: {
    // Navigation
    home: 'Home',
    search: 'Zoeken',
    explore: 'Verkennen',
    notifications: 'Meldingen',
    messages: 'Berichten',
    saved: 'Opgeslagen',
    profile: 'Profiel',
    settings: 'Instellingen',
    
    // Common actions
    like: 'Vind ik leuk',
    comment: 'Reageren',
    share: 'Delen',
    save: 'Opslaan',
    edit: 'Bewerken',
    delete: 'Verwijderen',
    cancel: 'Annuleren',
    confirm: 'Bevestigen',
    
    // Profile
    posts: 'Berichten',
    followers: 'Volgers',
    following: 'Volgend',
    about: 'Over',
    photos: 'Foto\'s',
    editProfile: 'Profiel bewerken',
    
    // Settings
    profileSettings: 'Profiel',
    notificationSettings: 'Meldingen',
    privacy: 'Privacy',
    appearance: 'Uiterlijk',
    language: 'Taal',
    help: 'Hulp',
    
    // Messages
    writeComment: 'Schrijf je reactie:',
    commentAdded: 'Reactie toegevoegd!',
    linkCopied: 'Link gekopieerd!',
    postSaved: 'Bericht opgeslagen!',
    failed_to_load_conversations: 'Laden van gesprekken mislukt',
    failed_to_load_messages: 'Laden van berichten mislukt',
    success: 'Succes',
    message_sent: 'Bericht verzonden',
    failed_to_send_message: 'Verzenden van bericht mislukt',
    active_now: 'Nu actief',
    active_minutes_ago: 'Actief {count} minuten geleden',
    active_hours_ago: 'Actief {count} uur geleden',
    active_days_ago: 'Actief {count} dagen geleden',
    search_conversations: 'Gesprekken zoeken',
    no_messages: 'Nog geen berichten',
    online: 'Online',
    offline: 'Offline',
    type_message: 'Typ een bericht',
    select_conversation: 'Selecteer een gesprek',
    choose_conversation_to_start: 'Kies een gesprek om te beginnen met chatten',
    
    // Notifications
    unread: 'ongelezen',
    markAllRead: 'Alles markeren als gelezen',
    all: 'Alle',
    
    // Search
    searchPlaceholder: 'Zoek studenten, berichten, hashtags...',
    users: 'Gebruikers',
    hashtags: 'Hashtags',
    schools: 'Scholen',
    
    // Post creation
    whatsNew: 'Wat is er nieuw in je studie?',
    createPost: 'Bericht maken',
    publish: 'Publiceren',
    
    // Landing page
    tagline: 'Het veilige studentennetwerk voor België',
    description: 'Verbind met studenten uit heel België. Deel je successen, vind hulp, bouw je academische netwerk.',
    joinStudentGram: 'Word lid van StudentGram',
    freeForStudents: 'Gratis voor alle Belgische studenten',
    
    // Auth messages
    goodbye: 'Tot ziens!',
    signedOut: 'Je bent uitgelogd van StudentGram.',
    error: 'Fout',
    
    // Loading messages
    verifying_authentication: 'Authenticatie verifiëren...',
    loading_page: 'Pagina laden...',
    loading: 'Laden...'
  }
};

export const t = (key: keyof typeof translations.fr, lang: Language = 'fr'): string => {
  return translations[lang][key] || key;
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.en, params?: { count?: number }) => {
    let text = translations[language][key] || key;
    
    // Handle interpolation for count parameter
    if (params?.count !== undefined) {
      text = text.replace('{count}', params.count.toString());
    }
    
    return text;
  };
  
  return { t };
};
