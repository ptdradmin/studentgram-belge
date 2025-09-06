// Utilitaires de validation pour StudentGram
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Niveaux d'études valides
export const VALID_STUDY_LEVELS = [
  'licence1',
  'licence2', 
  'licence3',
  'master1',
  'master2',
  'doctorat',
  'autre'
] as const;

export type StudyLevel = typeof VALID_STUDY_LEVELS[number];

// Validation des niveaux d'études
export function validateStudyLevel(level: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!level) {
    errors.push('Le niveau d\'études est requis');
    return { isValid: false, errors };
  }
  
  if (typeof level !== 'string') {
    errors.push('Le niveau d\'études doit être une chaîne de caractères');
    return { isValid: false, errors };
  }
  
  if (!VALID_STUDY_LEVELS.includes(level as StudyLevel)) {
    errors.push(`Niveau d'études invalide. Valeurs acceptées: ${VALID_STUDY_LEVELS.join(', ')}`);
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors: [] };
}

// Validation des données de post
export function validatePostData(post: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!post || typeof post !== 'object') {
    errors.push('Les données du post sont invalides');
    return { isValid: false, errors };
  }
  
  const postObj = post as Record<string, unknown>;
  
  // Validation de l'ID
  if (!postObj.id || typeof postObj.id !== 'string') {
    errors.push('L\'ID du post est requis et doit être une chaîne');
  }
  
  // Validation du nom d'utilisateur
  if (!postObj.username || typeof postObj.username !== 'string') {
    errors.push('Le nom d\'utilisateur est requis');
  }
  
  // Validation du contenu
  if (!postObj.content || typeof postObj.content !== 'string') {
    errors.push('Le contenu du post est requis');
  } else if (postObj.content.length > 2000) {
    errors.push('Le contenu du post ne peut pas dépasser 2000 caractères');
  }
  
  // Validation de la date de création
  if (!postObj.createdAt || typeof postObj.createdAt !== 'string') {
    errors.push('La date de création est requise');
  } else {
    const date = new Date(postObj.createdAt);
    if (isNaN(date.getTime())) {
      errors.push('Format de date invalide');
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Validation des données de commentaire
export function validateCommentData(comment: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!comment || typeof comment !== 'object') {
    errors.push('Les données du commentaire sont invalides');
    return { isValid: false, errors };
  }
  
  const commentObj = comment as Record<string, unknown>;
  
  // Validation de l'ID
  if (!commentObj.id || typeof commentObj.id !== 'string') {
    errors.push('L\'ID du commentaire est requis');
  }
  
  // Validation du nom d'utilisateur
  if (!commentObj.username || typeof commentObj.username !== 'string') {
    errors.push('Le nom d\'utilisateur est requis');
  }
  
  // Validation du contenu
  if (!commentObj.content || typeof commentObj.content !== 'string') {
    errors.push('Le contenu du commentaire est requis');
  } else if (commentObj.content.length > 500) {
    errors.push('Le contenu du commentaire ne peut pas dépasser 500 caractères');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Validation des données utilisateur
export function validateUserData(user: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!user || typeof user !== 'object') {
    errors.push('Les données utilisateur sont invalides');
    return { isValid: false, errors };
  }
  
  const userObj = user as Record<string, unknown>;
  
  // Validation de l'email
  if (!userObj.email || typeof userObj.email !== 'string') {
    errors.push('L\'email est requis');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userObj.email)) {
      errors.push('Format d\'email invalide');
    }
  }
  
  // Validation du nom d'utilisateur
  if (!userObj.username || typeof userObj.username !== 'string') {
    errors.push('Le nom d\'utilisateur est requis');
  } else if (userObj.username.length < 3) {
    errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
  } else if (userObj.username.length > 30) {
    errors.push('Le nom d\'utilisateur ne peut pas dépasser 30 caractères');
  }
  
  // Validation du niveau d'études si présent
  if (userObj.studyLevel) {
    const studyLevelValidation = validateStudyLevel(userObj.studyLevel);
    if (!studyLevelValidation.isValid) {
      errors.push(...studyLevelValidation.errors);
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Filtre sécurisé pour les listes de données
export function safeFilter<T>(
  items: unknown[], 
  validator: (item: unknown) => ValidationResult
): T[] {
  if (!Array.isArray(items)) {
    console.warn('safeFilter: input is not an array', items);
    return [];
  }
  
  return items.filter(item => {
    const validation = validator(item);
    if (!validation.isValid) {
      console.warn('safeFilter: invalid item filtered out', validation.errors, item);
      return false;
    }
    return true;
  }) as T[];
}

// Validation générique avec gestion d'erreurs
export function safeValidate<T>(
  data: unknown,
  validator: (data: unknown) => ValidationResult,
  fallback: T
): T {
  try {
    const validation = validator(data);
    if (validation.isValid) {
      return data as T;
    } else {
      console.warn('safeValidate: validation failed', validation.errors, data);
      return fallback;
    }
  } catch (error) {
    console.error('safeValidate: validation error', error, data);
    return fallback;
  }
}

// Utilitaire pour nettoyer les chaînes de caractères
export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Supprime les caractères potentiellement dangereux
}

// Utilitaire pour valider et nettoyer les URLs
export function validateAndSanitizeUrl(url: unknown): string | null {
  if (typeof url !== 'string') {
    return null;
  }
  
  try {
    const urlObj = new URL(url);
    // Autorise seulement http et https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return null;
    }
    return urlObj.toString();
  } catch {
    return null;
  }
}
