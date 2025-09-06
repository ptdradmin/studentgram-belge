import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import { validateBelgianStudentEmail, EmailVerificationResult } from '@/lib/belgian-domains';

interface VerificationSystemProps {
  email: string;
  onVerificationComplete?: (verified: boolean) => void;
}

export const VerificationSystem: React.FC<VerificationSystemProps> = ({
  email,
  onVerificationComplete
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [verificationResult, setVerificationResult] = useState<EmailVerificationResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  React.useEffect(() => {
    if (email) {
      const result = validateBelgianStudentEmail(email);
      setVerificationResult(result);
    }
  }, [email]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t('error'),
        description: 'Seuls les fichiers JPG, PNG et PDF sont acceptés.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('error'),
        description: 'Le fichier ne peut pas dépasser 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: t('success'),
        description: 'Document téléchargé avec succès. En attente de vérification.',
      });

      // Simulate admin review process
      setTimeout(() => {
        setVerificationStatus('approved'); // In real app, this would come from admin action
        onVerificationComplete?.(true);
      }, 3000);

    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erreur lors du téléchargement. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'approved':
        return 'Votre compte a été vérifié avec succès !';
      case 'rejected':
        return 'Votre demande de vérification a été rejetée. Veuillez contacter le support.';
      default:
        return 'Votre demande est en cours de vérification par nos administrateurs.';
    }
  };

  if (!verificationResult) {
    return null;
  }

  // Automatic verification for recognized domains
  if (verificationResult.isValid && !verificationResult.requiresManualVerification) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Vérification Automatique</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Votre adresse email {email} a été automatiquement vérifiée comme appartenant à une institution éducative belge reconnue.
            </AlertDescription>
          </Alert>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Institution:</strong> {verificationResult.institutionType === 'university' ? 'Université' : 
                                           verificationResult.institutionType === 'college' ? 'Haute École' : 
                                           'École Spécialisée'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Manual verification required
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span>Vérification Manuelle Requise</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {verificationResult.message}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-semibold">Documents Acceptés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">📄 Carte d'Étudiant</h4>
              <p className="text-muted-foreground">
                Une photo claire de votre carte d'étudiant officielle avec votre nom et l'institution visible.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">📋 Attestation d'Inscription</h4>
              <p className="text-muted-foreground">
                Document officiel prouvant votre inscription dans une institution belge.
              </p>
            </div>
          </div>
        </div>

        {!uploadedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Télécharger votre document</h3>
            <p className="text-muted-foreground mb-4">
              Formats acceptés: JPG, PNG, PDF (max 5MB)
            </p>
            <label htmlFor="verification-upload" className="cursor-pointer">
              <Button asChild>
                <span>Choisir un fichier</span>
              </Button>
            </label>
            <input
              id="verification-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {getStatusIcon()}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Téléchargement en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Alert>
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <AlertDescription>{getStatusMessage()}</AlertDescription>
              </div>
            </Alert>

            {verificationStatus === 'pending' && !isUploading && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Prochaines Étapes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Nos administrateurs examineront votre document</li>
                  <li>• Vous recevrez une notification par email</li>
                  <li>• Le processus prend généralement 24-48 heures</li>
                </ul>
              </div>
            )}

            {verificationStatus === 'approved' && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Félicitations ! 🎉</h4>
                <p className="text-sm text-green-800">
                  Votre compte a été vérifié. Vous avez maintenant accès à toutes les fonctionnalités de StudentGram.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Vos documents sont traités de manière confidentielle et supprimés après vérification. 
            Pour toute question, contactez notre support à support@studentgram.be
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
