/**
 * 🚩 FEATURE FLAGS - Gestione delle Funzionalità
 * 
 * I Feature Flags (o Feature Toggles) permettono di:
 * 
 * 1. RILASCIO GRADUALE (Canary Releases)
 *    - Abilitare feature solo per una percentuale di utenti
 *    - Rollout progressivo per ridurre rischi
 * 
 * 2. KILL SWITCH
 *    - Disabilitare istantaneamente feature problematiche
 *    - Senza necessità di nuovo deploy
 * 
 * 3. A/B TESTING
 *    - Testare varianti diverse della stessa feature
 *    - Raccogliere dati su quale versione performa meglio
 * 
 * 4. TRUNK-BASED DEVELOPMENT
 *    - Merge codice incompleto nel main branch
 *    - Feature nascosta dietro flag fino a completamento
 * 
 * 5. PERSONALIZZAZIONE
 *    - Feature diverse per utenti diversi (es. premium vs free)
 *    - Accesso anticipato per beta tester
 */

import { getCurrentEnvironment, type Environment } from './environment';

/**
 * Definizione di un Feature Flag
 * 
 * Ogni flag ha:
 * - id: identificatore univoco
 * - name: nome leggibile
 * - description: spiegazione della feature
 * - enabled: stato attuale (per ambiente)
 * - rolloutPercentage: % di utenti che vedono la feature
 */
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: Record<Environment, boolean>;
  rolloutPercentage?: number; // 0-100, opzionale
  metadata?: {
    owner: string;       // Team responsabile
    createdAt: string;   // Data creazione
    expiresAt?: string;  // Data scadenza (per flag temporanei)
    jiraTicket?: string; // Riferimento al ticket
  };
}

/**
 * Registro centrale dei Feature Flags
 * 
 * In produzione, questi potrebbero venire da:
 * - Database
 * - Servizio dedicato (LaunchDarkly, Unleash, etc.)
 * - File di configurazione remoto
 */
export const featureFlags: FeatureFlag[] = [
  {
    id: 'dark_mode_v2',
    name: 'Dark Mode V2',
    description: 'Nuova versione del tema scuro con migliore contrasto e accessibilità',
    enabled: {
      development: true,   // Sempre attivo in dev per testing
      staging: true,       // Attivo in staging per QA
      production: false,   // Non ancora rilasciato in produzione
    },
    rolloutPercentage: 100,
    metadata: {
      owner: 'Team UI/UX',
      createdAt: '2024-01-15',
      jiraTicket: 'UI-1234',
    },
  },
  {
    id: 'new_dashboard',
    name: 'New Dashboard Layout',
    description: 'Dashboard ridisegnata con widget drag-and-drop e personalizzazione',
    enabled: {
      development: true,
      staging: true,
      production: true,    // Rilasciato gradualmente
    },
    rolloutPercentage: 50,  // Solo 50% degli utenti in produzione
    metadata: {
      owner: 'Team Product',
      createdAt: '2024-02-01',
      jiraTicket: 'DASH-567',
    },
  },
  {
    id: 'ai_suggestions',
    name: 'AI-Powered Suggestions',
    description: 'Suggerimenti intelligenti basati su machine learning',
    enabled: {
      development: true,
      staging: false,      // Richiede risorse AI non disponibili in staging
      production: false,   // In attesa di approvazione budget
    },
    metadata: {
      owner: 'Team ML',
      createdAt: '2024-03-01',
      expiresAt: '2024-12-31', // Flag sperimentale
    },
  },
  {
    id: 'beta_api_v2',
    name: 'API V2 Beta',
    description: 'Nuova versione delle API con performance migliorate',
    enabled: {
      development: true,
      staging: true,
      production: false,
    },
    rolloutPercentage: 25,
    metadata: {
      owner: 'Team Backend',
      createdAt: '2024-02-15',
      jiraTicket: 'API-890',
    },
  },
  {
    id: 'export_pdf',
    name: 'PDF Export',
    description: 'Permette agli utenti di esportare report in formato PDF',
    enabled: {
      development: true,
      staging: true,
      production: true,
    },
    rolloutPercentage: 100,
    metadata: {
      owner: 'Team Reports',
      createdAt: '2023-12-01',
    },
  },
];

/**
 * Verifica se un feature flag è abilitato
 * 
 * @param flagId - ID del feature flag
 * @returns true se la feature è abilitata per l'ambiente corrente
 * 
 * USO:
 * ```typescript
 * if (isFeatureEnabled('new_dashboard')) {
 *   return <NewDashboard />;
 * }
 * return <OldDashboard />;
 * ```
 */
export const isFeatureEnabled = (flagId: string): boolean => {
  const flag = featureFlags.find(f => f.id === flagId);
  
  if (!flag) {
    console.warn(`Feature flag "${flagId}" non trovato!`);
    return false;
  }
  
  const currentEnv = getCurrentEnvironment();
  const isEnabledForEnv = flag.enabled[currentEnv];
  
  // Se non è abilitato per l'ambiente, ritorna false
  if (!isEnabledForEnv) return false;
  
  // Se c'è un rollout percentage, simula la logica
  // (in produzione useresti l'ID utente per consistenza)
  if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
    // Per demo, usiamo un valore random
    // In produzione: hash(userId + flagId) % 100 < rolloutPercentage
    return Math.random() * 100 < flag.rolloutPercentage;
  }
  
  return true;
};

/**
 * Hook-like function per ottenere tutti i flag con il loro stato
 * (In React, questo sarebbe un custom hook)
 */
export const getAllFeatureFlags = () => {
  const currentEnv = getCurrentEnvironment();
  
  return featureFlags.map(flag => ({
    ...flag,
    currentlyEnabled: flag.enabled[currentEnv],
  }));
};
