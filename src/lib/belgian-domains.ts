/**
 * Comprehensive list of Belgian educational institution domains
 * This list includes universities, colleges, and recognized educational institutions
 */

export const BELGIAN_UNIVERSITY_DOMAINS = [
  // French-speaking Universities (Universités francophones)
  'uclouvain.be',           // Université catholique de Louvain
  'ulb.be',                 // Université libre de Bruxelles
  'uliege.be',              // Université de Liège
  'unamur.be',              // Université de Namur
  'usaintlouis.be',         // Université Saint-Louis - Bruxelles
  'umons.be',               // Université de Mons
  
  // Dutch-speaking Universities (Vlaamse universiteiten)
  'kuleuven.be',            // KU Leuven
  'ugent.be',               // Universiteit Gent
  'uantwerpen.be',          // Universiteit Antwerpen
  'vub.be',                 // Vrije Universiteit Brussel
  'uhasselt.be',            // Universiteit Hasselt
  'student.kuleuven.be',    // KU Leuven student domain
  'student.ugent.be',       // UGent student domain
  'student.uantwerpen.be',  // UAntwerpen student domain
];

export const BELGIAN_COLLEGE_DOMAINS = [
  // Hautes Écoles / Hogescholen
  'vinci.be',               // Haute École Léonard de Vinci
  'galilee.be',             // Haute École Galilée
  'ephec.be',               // EPHEC
  'ichec.be',               // ICHEC Brussels Management School
  'helha.be',               // Haute École Louvain en Hainaut
  'heh.be',                 // Haute École en Hainaut
  'henallux.be',            // Haute École de Namur-Liège-Luxembourg
  'hers.be',                // Haute École Robert Schuman
  'helmo.be',               // Haute École Libre Mosane
  'hepl.be',                // Haute École de la Province de Liège
  'condorcet.be',           // Haute École Condorcet
  'helb-prigogine.be',      // Haute École Libre de Bruxelles Ilya Prigogine
  'he-ferrer.be',           // Haute École Francisco Ferrer
  'hepn.be',                // Haute École de la Province de Namur
  
  // Flemish Colleges
  'arteveldehs.be',         // Artevelde Hogeschool
  'hogent.be',              // Hogeschool Gent
  'howest.be',              // Hogeschool West-Vlaanderen
  'thomasmore.be',          // Thomas More Hogeschool
  'ucll.be',                // UC Leuven-Limburg
  'kdg.be',                 // Karel de Grote Hogeschool
  'ap.be',                  // Artesis Plantijn Hogeschool
  'ehb.be',                 // Erasmushogeschool Brussel
  'vives.be',               // VIVES Hogeschool
  'odisee.be',              // Odisee Hogeschool
  'pxl.be',                 // PXL Hogeschool
  'luca-arts.be',           // LUCA School of Arts
];

export const BELGIAN_SPECIALIZED_SCHOOLS = [
  // Business Schools
  'solvay.edu',             // Solvay Brussels School
  'vlerick.com',            // Vlerick Business School
  'ieseg.fr',               // IESEG (has Belgian campus)
  
  // Art Schools
  'arba-esa.be',            // École supérieure des arts
  'lacambre.be',            // La Cambre
  'ensav.be',               // École nationale supérieure des arts visuels
  'academieroyaledesbeauxarts.be', // Académie royale des Beaux-Arts
  
  // Technical Schools
  'ecam.be',                // ECAM Brussels Engineering School
  'isib.be',                // Institut supérieur industriel de Bruxelles
  'hei.be',                 // Haute École d'Ingénierie
];

// Combined list of all recognized domains
export const ALL_BELGIAN_EDUCATIONAL_DOMAINS = [
  ...BELGIAN_UNIVERSITY_DOMAINS,
  ...BELGIAN_COLLEGE_DOMAINS,
  ...BELGIAN_SPECIALIZED_SCHOOLS,
];

/**
 * Check if an email domain is from a recognized Belgian educational institution
 */
export const isRecognizedBelgianEducationalDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return ALL_BELGIAN_EDUCATIONAL_DOMAINS.includes(domain);
};

/**
 * Get the institution type based on domain
 */
export const getInstitutionType = (email: string): 'university' | 'college' | 'specialized' | 'unknown' => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return 'unknown';
  
  if (BELGIAN_UNIVERSITY_DOMAINS.includes(domain)) return 'university';
  if (BELGIAN_COLLEGE_DOMAINS.includes(domain)) return 'college';
  if (BELGIAN_SPECIALIZED_SCHOOLS.includes(domain)) return 'specialized';
  
  return 'unknown';
};

/**
 * Validation result for email verification
 */
export interface EmailVerificationResult {
  isValid: boolean;
  institutionType: 'university' | 'college' | 'specialized' | 'unknown';
  requiresManualVerification: boolean;
  message: string;
}

/**
 * Comprehensive email validation for Belgian students
 */
export const validateBelgianStudentEmail = (email: string): EmailVerificationResult => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      institutionType: 'unknown',
      requiresManualVerification: false,
      message: 'Format d\'email invalide'
    };
  }
  
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Check if domain is recognized
  if (isRecognizedBelgianEducationalDomain(email)) {
    return {
      isValid: true,
      institutionType: getInstitutionType(email),
      requiresManualVerification: false,
      message: 'Domaine éducatif belge reconnu'
    };
  }
  
  // Check if it's a .be domain (potential Belgian institution not in our list)
  if (domain?.endsWith('.be')) {
    return {
      isValid: false,
      institutionType: 'unknown',
      requiresManualVerification: true,
      message: 'Domaine belge non reconnu. Vérification manuelle requise.'
    };
  }
  
  // Non-Belgian domain
  return {
    isValid: false,
    institutionType: 'unknown',
    requiresManualVerification: true,
    message: 'Ce domaine n\'est pas reconnu comme une institution éducative belge. Une vérification manuelle est nécessaire.'
  };
};
