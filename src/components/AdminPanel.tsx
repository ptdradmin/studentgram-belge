import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Download, User, Mail, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import { UserListSkeleton } from '@/components/SkeletonLoaders';

interface PendingVerification {
  id: string;
  userId: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  submittedAt: string;
  documentType: 'student_card' | 'enrollment_certificate';
  documentUrl: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface AdminPanelProps {
  currentAdminId: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentAdminId }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<PendingVerification | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  useEffect(() => {
    loadPendingVerifications();
  }, []);

  const loadPendingVerifications = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockVerifications: PendingVerification[] = [
        {
          id: 'ver1',
          userId: 'user1',
          email: 'marie.dubois@student.example.be',
          username: 'marie_student',
          fullName: 'Marie Dubois',
          avatar: '/placeholder.svg',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          documentType: 'student_card',
          documentUrl: '/mock-student-card.jpg',
          status: 'pending'
        },
        {
          id: 'ver2',
          userId: 'user2',
          email: 'thomas.martin@unknown-school.be',
          username: 'thomas_m',
          fullName: 'Thomas Martin',
          submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          documentType: 'enrollment_certificate',
          documentUrl: '/mock-certificate.pdf',
          status: 'pending'
        },
        {
          id: 'ver3',
          userId: 'user3',
          email: 'sophie.bernard@private-school.be',
          username: 'sophie_b',
          fullName: 'Sophie Bernard',
          avatar: '/placeholder.svg',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          documentType: 'student_card',
          documentUrl: '/mock-student-card-2.jpg',
          status: 'reviewing',
          reviewedBy: 'admin1'
        }
      ];
      
      setVerifications(mockVerifications);
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erreur lors du chargement des vérifications en attente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId: string) => {
    setReviewingId(verificationId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerifications(prev => prev.map(ver => 
        ver.id === verificationId 
          ? { 
              ...ver, 
              status: 'approved',
              reviewedBy: currentAdminId,
              reviewedAt: new Date().toISOString()
            }
          : ver
      ));
      
      toast({
        title: t('success'),
        description: 'Utilisateur vérifié avec succès.',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erreur lors de l\'approbation.',
        variant: 'destructive',
      });
    } finally {
      setReviewingId(null);
    }
  };

  const handleReject = async (verificationId: string, reason: string = 'Document non valide') => {
    setReviewingId(verificationId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerifications(prev => prev.map(ver => 
        ver.id === verificationId 
          ? { 
              ...ver, 
              status: 'rejected',
              reviewedBy: currentAdminId,
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason
            }
          : ver
      ));
      
      toast({
        title: t('success'),
        description: 'Demande rejetée.',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erreur lors du rejet.',
        variant: 'destructive',
      });
    } finally {
      setReviewingId(null);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  };

  const getStatusBadge = (status: PendingVerification['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'reviewing':
        return <Badge variant="outline"><Eye className="h-3 w-3 mr-1" />En cours</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
    }
  };

  const getDocumentTypeLabel = (type: PendingVerification['documentType']) => {
    return type === 'student_card' ? 'Carte d\'étudiant' : 'Attestation d\'inscription';
  };

  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const reviewingCount = verifications.filter(v => v.status === 'reviewing').length;
  const completedCount = verifications.filter(v => ['approved', 'rejected'].includes(v.status)).length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <UserListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panneau d'Administration</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pendingCount} en attente
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{reviewingCount}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Traitées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">En attente ({pendingCount})</TabsTrigger>
          <TabsTrigger value="reviewing">En cours ({reviewingCount})</TabsTrigger>
          <TabsTrigger value="completed">Traitées ({completedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {verifications.filter(v => v.status === 'pending').map((verification) => (
            <Card key={verification.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={verification.avatar} />
                      <AvatarFallback>
                        {verification.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{verification.fullName}</h3>
                        {getStatusBadge(verification.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>@{verification.username}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{verification.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatTimeAgo(verification.submittedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>{getDocumentTypeLabel(verification.documentType)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Examiner
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Vérification - {verification.fullName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Email:</strong> {verification.email}</div>
                            <div><strong>Nom d'utilisateur:</strong> @{verification.username}</div>
                            <div><strong>Type de document:</strong> {getDocumentTypeLabel(verification.documentType)}</div>
                            <div><strong>Soumis:</strong> {formatTimeAgo(verification.submittedAt)}</div>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Document soumis:</h4>
                            {verification.documentType === 'student_card' ? (
                              <img 
                                src={verification.documentUrl} 
                                alt="Carte d'étudiant" 
                                className="max-w-full h-auto rounded border"
                              />
                            ) : (
                              <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded">
                                <FileText className="h-8 w-8" />
                                <div>
                                  <p className="font-medium">Attestation d'inscription</p>
                                  <Button variant="outline" size="sm" className="mt-2">
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger PDF
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => handleReject(verification.id)}
                              disabled={reviewingId === verification.id}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </Button>
                            <Button 
                              onClick={() => handleApprove(verification.id)}
                              disabled={reviewingId === verification.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(verification.id)}
                      disabled={reviewingId === verification.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReject(verification.id)}
                      disabled={reviewingId === verification.id}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {pendingCount === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune vérification en attente</h3>
                <p className="text-muted-foreground">
                  Toutes les demandes de vérification ont été traitées.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviewing" className="space-y-4">
          {verifications.filter(v => v.status === 'reviewing').map((verification) => (
            <Card key={verification.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={verification.avatar} />
                      <AvatarFallback>
                        {verification.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{verification.fullName}</h3>
                        {getStatusBadge(verification.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        En cours d'examen par {verification.reviewedBy}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {verifications.filter(v => ['approved', 'rejected'].includes(v.status)).map((verification) => (
            <Card key={verification.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={verification.avatar} />
                      <AvatarFallback>
                        {verification.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{verification.fullName}</h3>
                        {getStatusBadge(verification.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Traité par {verification.reviewedBy} • {formatTimeAgo(verification.reviewedAt!)}
                      </p>
                      {verification.rejectionReason && (
                        <p className="text-sm text-red-600">
                          Raison: {verification.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
