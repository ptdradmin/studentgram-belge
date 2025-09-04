import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Shield, Heart, BookOpen, Camera, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import Sidebar from '@/components/Sidebar';
import TopHeader from '@/components/TopHeader';
import StoriesSection from '@/components/StoriesSection';
import ProfileSidebar from '@/components/ProfileSidebar';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import { 
  supabase, 
  getCurrentUser, 
  getProfile, 
  getFeedPosts, 
  toggleLike,
  Profile,
  Post,
  isSupabaseConfigured
} from '@/lib/supabase';

type ActiveTab = 'home' | 'search' | 'create' | 'notifications' | 'profile' | 'stories' | 'messages' | 'explorer' | 'saved' | 'settings';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const { toast } = useToast();

  // Check for existing session
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes only if Supabase is configured
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Load posts when user is authenticated
  useEffect(() => {
    if (user && profile && activeTab === 'home') {
      loadPosts();
    }
  }, [user, profile, activeTab]);

  const checkUser = async () => {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured yet');
        setLoading(false);
        return;
      }

      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile(currentUser.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await getProfile(userId);
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadPosts = async () => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured - using demo data');
      // Set some demo posts for preview
      setPosts([]);
      return;
    }

    setLoadingPosts(true);
    try {
      const { data, error } = await getFeedPosts(20);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les posts.",
          variant: "destructive"
        });
        return;
      }
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured');
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setPosts([]);
      setActiveTab('home');
      toast({
        title: "À bientôt!",
        description: "Tu es déconnecté de StudentGram."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter.",
        variant: "destructive"
      });
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    try {
      await toggleLike(postId, user.id);
      // Reload posts to get updated counts
      await loadPosts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de liker ce post.",
        variant: "destructive"
      });
    }
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    toast({
      title: "Bientôt disponible",
      description: "La fonction commentaires arrive bientôt!",
    });
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    toast({
      title: "Bientôt disponible", 
      description: "La fonction partage arrive bientôt!",
    });
  };

  const handleSave = (postId: string) => {
    // TODO: Implement save functionality
    toast({
      title: "Bientôt disponible",
      description: "La fonction sauvegarde arrive bientôt!",
    });
  };

  // Landing page for non-authenticated users
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold">StudentGram</h1>
                <p className="text-muted-foreground">Réseau Social Académique Belge</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Le réseau étudiant sécurisé pour la Belgique
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connecte-toi avec des étudiants de toute la Belgique. 
                Partage tes réussites, trouve de l'aide, construis ton réseau académique.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                <Shield className="h-12 w-12 text-verified mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sécurité Renforcée</h3>
                <p className="text-sm text-muted-foreground">
                  Vérification étudiante obligatoire. Protection spéciale pour les mineurs 
                  avec notifications parentales.
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Réseau Académique</h3>
                <p className="text-sm text-muted-foreground">
                  Connecte-toi par établissement, filière et niveau d'études. 
                  Trouve des mentors et des collaborateurs.
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                <BookOpen className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contenu Académique</h3>
                <p className="text-sm text-muted-foreground">
                  Partage tes projets, demande de l'aide, célèbre tes réussites. 
                  Modération automatique pour un environnement sain.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 p-6 bg-muted/30 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Étudiants Vérifiés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Modération Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">🇧🇪</div>
                <div className="text-sm text-muted-foreground">Fait en Belgique</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-verified">🔒</div>
                <div className="text-sm text-muted-foreground">Données Protégées</div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4 mt-8">
              {!isSupabaseConfigured() && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-4">
                  <h3 className="font-semibold text-primary mb-2">🔧 Configuration requise</h3>
                  <p className="text-sm text-primary/80">
                    Pour tester complètement StudentGram, connecte d'abord Supabase en cliquant sur le bouton vert en haut à droite.
                  </p>
                </div>
              )}
              
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={() => {
                  if (!isSupabaseConfigured()) {
                    toast({
                      title: "Configuration requise",
                      description: "Connecte d'abord Supabase pour utiliser l'authentification.",
                      variant: "destructive"
                    });
                    return;
                  }
                  setAuthModalOpen(true);
                }}
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                {isSupabaseConfigured() ? "Rejoindre StudentGram" : "Configuration Supabase Requise"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Gratuit pour tous les étudiants belges
              </p>
            </div>

            {/* Academic Levels */}
            <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-orange-800">Enseignement Secondaire</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-purple-800">Enseignement Supérieur</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-sm font-medium text-cyan-800">Universités</span>
              </div>
            </div>
          </div>
        </div>

        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    );
  }

  // Main App Interface
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={(tab: string) => setActiveTab(tab as ActiveTab)}
        currentUser={profile}
      />
      
      <TopHeader 
        currentUser={profile}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'home' && (
                <>
                  {/* Stories Section */}
                  <StoriesSection 
                    currentUser={profile}
                    stories={[]}
                    onCreateStory={() => setActiveTab('create')}
                  />

                  {/* Post Creation */}
                  <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold">
                        {profile?.fullName?.charAt(0) || 'KV'}
                      </div>
              <Button 
                variant="outline" 
                className="flex-1 justify-start text-gray-500 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-full"
                onClick={() => setActiveTab('create')}
              >
                        Quoi de neuf dans vos études ?
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-pink-600">
                        <Camera className="h-4 w-4" />
                        Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-pink-600">
                        <Smile className="h-4 w-4" />
                        Emoji
                      </Button>
                      <Button 
                        className="px-6 text-white font-medium border-0"
                        style={{background: 'var(--gradient-primary)'}}
                        onClick={() => setActiveTab('create')}
                      >
                        Publier
                      </Button>
                    </div>
                  </div>

                  {/* Posts Feed */}
                  <div className="space-y-6">
                    {loadingPosts ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des posts...</p>
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="text-center py-12 space-y-4 bg-white rounded-lg border">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Aucun post pour l'instant</h3>
                          <p className="text-gray-600">
                            Sois le premier à partager quelque chose avec la communauté!
                          </p>
                        </div>
                        <Button 
                          className="text-white font-medium"
                          style={{background: 'var(--gradient-primary)'}}
                          onClick={() => setActiveTab('create')}
                        >
                          Créer le premier post
                        </Button>
                      </div>
                    ) : (
                      posts.map(post => (
                        <PostCard
                          key={post.id}
                          post={post}
                          currentUser={profile}
                          onLike={handleLike}
                          onComment={handleComment}
                          onShare={handleShare}
                          onSave={handleSave}
                        />
                      ))
                    )}
                  </div>
                </>
              )}

              {activeTab === 'create' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border p-6">
                    <div className="text-center py-4">
                      <h1 className="text-2xl font-bold text-gray-900">Créer un Post</h1>
                      <p className="text-gray-600">
                        Partage tes pensées avec la communauté étudiante
                      </p>
                    </div>
                    <CreatePost
                      currentUser={profile}
                      onPostCreated={() => {
                        setActiveTab('home');
                        loadPosts();
                      }}
                    />
                  </div>
                </div>
              )}

              {(activeTab === 'search' || activeTab === 'explorer' || activeTab === 'notifications' || activeTab === 'messages' || activeTab === 'saved' || activeTab === 'profile' || activeTab === 'settings') && (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    {activeTab === 'search' && 'Recherche'}
                    {activeTab === 'explorer' && 'Explorer'}
                    {activeTab === 'notifications' && 'Notifications'}  
                    {activeTab === 'messages' && 'Messages'}
                    {activeTab === 'saved' && 'Enregistrés'}
                    {activeTab === 'profile' && 'Profil'}
                    {activeTab === 'settings' && 'Paramètres'}
                  </h2>
                  <p className="text-gray-600">Fonctionnalité bientôt disponible</p>
                </div>
              )}
            </div>

            {/* Right Column - Profile Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar currentUser={profile} />
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;