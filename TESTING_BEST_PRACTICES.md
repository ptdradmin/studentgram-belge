# Guide des Bonnes Pratiques pour les Tests Asynchrones

## Problèmes Courants et Solutions

### 1. Timeouts dans les Tests (Test timed out in 5000ms)

#### Causes principales :
- **Fake timers mal utilisés** : `vi.useFakeTimers()` avec `vi.runAllTimers()` peut bloquer les promesses
- **Mocks non réinitialisés** : État persistant entre les tests
- **Promesses non résolues** : Mocks qui ne retournent pas de promesses
- **Nettoyage incorrect** : `vi.restoreAllMocks()` peut interférer avec les configurations

#### Solutions :

```typescript
// ✅ Structure correcte
describe('Component', () => {
  beforeEach(() => {
    // Réinitialiser TOUS les mocks
    vi.resetAllMocks();
    
    // Configurer les mocks par défaut
    (api.getData as vi.Mock).mockResolvedValue(mockData);
    (useHook as vi.Mock).mockReturnValue(mockValue);
  });

  afterEach(() => {
    // Nettoyer seulement les appels, pas les implémentations
    vi.clearAllMocks();
  });
});
```

### 2. Gestion des Opérations Asynchrones

#### ✅ Bonnes pratiques :

```typescript
// Attendre les éléments asynchrones
it('renders data after loading', async () => {
  render(<Component />);
  
  // ✅ Utiliser findBy* pour les éléments asynchrones
  expect(await screen.findByText('Data loaded')).toBeInTheDocument();
  
  // ✅ Pas besoin de fake timers pour les vraies promesses
});

// Interactions utilisateur asynchrones
it('handles button click', async () => {
  render(<Component />);
  
  const button = await screen.findByRole('button');
  
  // ✅ Wrapper les interactions dans act()
  await act(async () => {
    fireEvent.click(button);
  });
  
  expect(await screen.findByText('Action completed')).toBeInTheDocument();
});
```

#### ❌ À éviter :

```typescript
// ❌ Fake timers avec vraies promesses
beforeEach(() => {
  vi.useFakeTimers(); // Problématique avec les vraies API
});

// ❌ getBy* pour du contenu asynchrone
it('bad test', () => {
  render(<Component />);
  expect(screen.getByText('Async data')).toBeInTheDocument(); // Timeout!
});

// ❌ Nettoyage excessif
afterEach(() => {
  vi.restoreAllMocks(); // Peut casser les mocks suivants
});
```

### 3. Configuration des Mocks API

#### ✅ Mocks corrects :

```typescript
// Mock du module complet
vi.mock('@/lib/api');

beforeEach(() => {
  vi.resetAllMocks();
  
  // ✅ Toujours retourner des promesses résolues
  (api.fetchUser as vi.Mock).mockResolvedValue(mockUser);
  (api.updateUser as vi.Mock).mockResolvedValue({ success: true });
  
  // ✅ Pour les erreurs, utiliser mockRejectedValue
  // (api.fetchUser as vi.Mock).mockRejectedValue(new Error('API Error'));
});

// ✅ Surcharge pour un test spécifique
it('handles error', async () => {
  (api.fetchUser as vi.Mock).mockRejectedValue(new Error('Network error'));
  
  render(<Component />);
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

#### ❌ Mocks problématiques :

```typescript
// ❌ Mock qui ne retourne rien (undefined)
(api.fetchData as vi.Mock).mockReturnValue(undefined);

// ❌ Mock synchrone pour une API asynchrone
(api.fetchData as vi.Mock).mockReturnValue(data);

// ❌ Chemin incorrect dans vi.mock
vi.mock('wrong/path/to/api'); // Le mock ne fonctionne pas
```

### 4. Patterns de Test Recommandés

#### Test d'un composant avec API :

```typescript
describe('UserProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (api.getUserProfile as vi.Mock).mockResolvedValue(mockUser);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays user data', async () => {
    render(<UserProfile userId="123" />);
    
    // Attendre que les données se chargent
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    
    // Vérifier l'appel API
    expect(api.getUserProfile).toHaveBeenCalledWith('123');
  });

  it('handles loading state', () => {
    render(<UserProfile userId="123" />);
    
    // Le skeleton doit être visible immédiatement
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
});
```

#### Test d'interactions utilisateur :

```typescript
it('submits form on button click', async () => {
  const mockSubmit = vi.fn().mockResolvedValue({ success: true });
  (api.submitForm as vi.Mock).mockImplementation(mockSubmit);
  
  render(<Form />);
  
  // Remplir le formulaire
  const input = screen.getByLabelText('Name');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'John' } });
  });
  
  // Soumettre
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await act(async () => {
    fireEvent.click(submitButton);
  });
  
  // Vérifier l'appel
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({ name: 'John' });
  });
});
```

### 5. Debugging des Tests qui Timeout

#### Étapes de diagnostic :

1. **Isoler le test** :
   ```typescript
   it.only('specific test', async () => {
     // Test isolé pour debug
   });
   ```

2. **Vérifier les mocks** :
   ```typescript
   console.log('Mock calls:', (api.fetchData as vi.Mock).mock.calls);
   ```

3. **Augmenter temporairement le timeout** :
   ```typescript
   it('test with longer timeout', async () => {
     // Test logic
   }, 10000); // 10 secondes
   ```

4. **Vérifier les chemins de mock** :
   ```typescript
   // S'assurer que le chemin est correct
   vi.mock('@/lib/api'); // Doit correspondre exactement à l'import
   ```

### 6. Checklist Avant de Commiter

- [ ] Tous les mocks utilisent `mockResolvedValue` ou `mockRejectedValue`
- [ ] `beforeEach` utilise `vi.resetAllMocks()`
- [ ] `afterEach` utilise seulement `vi.clearAllMocks()`
- [ ] Pas de `vi.useFakeTimers()` avec de vraies promesses
- [ ] Utilisation de `screen.findBy*` pour le contenu asynchrone
- [ ] Interactions utilisateur wrappées dans `act()`
- [ ] Tests isolés avec `it.only` supprimés

### 7. Exemple Complet

```typescript
import React from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, act, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import { Component } from '../Component';
import * as api from '@/lib/api';

// Mock du module API
vi.mock('@/lib/api');

const mockData = { id: '1', name: 'Test' };

describe('Component', () => {
  beforeEach(() => {
    // Réinitialisation complète
    vi.resetAllMocks();
    
    // Configuration par défaut
    (api.fetchData as vi.Mock).mockResolvedValue(mockData);
    (api.updateData as vi.Mock).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    // Nettoyage léger
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<Component />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('displays data after loading', async () => {
    render(<Component />);
    
    expect(await screen.findByText('Test')).toBeInTheDocument();
    expect(api.fetchData).toHaveBeenCalledTimes(1);
  });

  it('handles user interaction', async () => {
    render(<Component />);
    
    const button = await screen.findByRole('button');
    
    await act(async () => {
      fireEvent.click(button);
    });
    
    await waitFor(() => {
      expect(api.updateData).toHaveBeenCalled();
    });
  });

  it('handles error state', async () => {
    (api.fetchData as vi.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<Component />);
    
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
```

Cette approche garantit des tests stables, rapides et sans timeouts.
