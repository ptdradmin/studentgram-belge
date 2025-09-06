import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import LoadingSpinner from './LoadingSpinner';

interface ColdStartIndicatorProps {
  isLoading: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  estimatedWaitTime?: number; // in seconds
  serviceName?: string;
}

const ColdStartIndicator: React.FC<ColdStartIndicatorProps> = ({
  isLoading,
  hasError = false,
  onRetry,
  estimatedWaitTime = 30,
  serviceName = "l'API"
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showColdStartMessage, setShowColdStartMessage] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          // Show cold start message after 5 seconds
          if (newTime >= 5) {
            setShowColdStartMessage(true);
          }
          return newTime;
        });
      }, 1000);
    } else {
      setElapsedTime(0);
      setShowColdStartMessage(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  if (hasError) {
    return (
      <Alert className="border-destructive bg-destructive/10">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="flex items-center justify-between">
          <span>Erreur de connexion à {serviceName}. Veuillez réessayer.</span>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="ml-2"
            >
              Réessayer
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoading) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" text={`Connexion à ${serviceName}...`} />
      </div>
      
      {showColdStartMessage && (
        <Alert className="border-blue-200 bg-blue-50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  Démarrage à froid en cours...
                </span>
                <span className="text-xs text-blue-600">
                  {elapsedTime}s / ~{estimatedWaitTime}s
                </span>
              </div>
              
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min((elapsedTime / estimatedWaitTime) * 100, 100)}%` 
                  }}
                />
              </div>
              
              <p className="text-xs text-blue-700">
                {elapsedTime < 10 ? (
                  <>
                    <Zap className="inline h-3 w-3 mr-1" />
                    Le serveur se réveille, cela peut prendre quelques secondes...
                  </>
                ) : elapsedTime < 20 ? (
                  "Initialisation des services en cours..."
                ) : (
                  "Presque prêt ! Merci de votre patience."
                )}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ColdStartIndicator;
