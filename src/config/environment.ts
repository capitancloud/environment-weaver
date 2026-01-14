/**
 * 🔧 CONFIGURAZIONE AMBIENTE - Environment Manager
 * 
 * Questo file dimostra le BEST PRACTICES per la gestione delle configurazioni.
 * 
 * ⚠️ PERCHÉ NON HARDCODARE I VALORI?
 * 
 * 1. SICUREZZA: Le chiavi API e credenziali non devono essere nel codice sorgente
 *    - Il codice viene committato in repository (potenzialmente pubblici)
 *    - Le chiavi hardcodate sono facilmente estraibili dal bundle JS
 * 
 * 2. FLESSIBILITÀ: Lo stesso codice deve funzionare in ambienti diversi
 *    - Development: localhost, debug attivo, API di test
 *    - Staging: server di test, dati fittizi
 *    - Production: server live, dati reali
 * 
 * 3. MANUTENIBILITÀ: Cambiare configurazione senza ricompilare
 *    - Aggiornare URL senza deploy
 *    - Abilitare/disabilitare feature senza modificare codice
 * 
 * 4. COLLABORAZIONE: Ogni sviluppatore può avere config locali diverse
 *    - File .env.local non viene committato
 *    - Variabili d'ambiente specifiche per ogni macchina
 */

// Determina l'ambiente corrente usando import.meta.env di Vite
// In Vite, le variabili VITE_* sono esposte al frontend
export type Environment = 'development' | 'staging' | 'production';

/**
 * Rileva l'ambiente corrente basandosi su import.meta.env.MODE
 * 
 * Vite imposta automaticamente:
 * - 'development' quando esegui `vite` o `vite dev`
 * - 'production' quando esegui `vite build`
 * 
 * Puoi anche usare variabili custom come VITE_APP_ENV
 */
export const getCurrentEnvironment = (): Environment => {
  // Prima controlla se c'è una variabile custom
  const customEnv = import.meta.env.VITE_APP_ENV as string | undefined;
  
  if (customEnv === 'staging') return 'staging';
  if (customEnv === 'production') return 'production';
  
  // Altrimenti usa MODE di Vite
  if (import.meta.env.MODE === 'production') return 'production';
  
  return 'development';
};

/**
 * Configurazione specifica per ambiente
 * 
 * Questo pattern permette di avere configurazioni diverse
 * per ogni ambiente, tutte in un unico posto.
 */
interface EnvironmentConfig {
  name: Environment;
  displayName: string;
  apiUrl: string;
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  features: {
    analytics: boolean;
    errorReporting: boolean;
    experimentalFeatures: boolean;
  };
}

const configs: Record<Environment, EnvironmentConfig> = {
  development: {
    name: 'development',
    displayName: 'Development',
    apiUrl: 'http://localhost:3000/api',
    debugMode: true,
    logLevel: 'debug',
    features: {
      analytics: false,           // Non tracciamo in development
      errorReporting: false,      // Log locali sono sufficienti
      experimentalFeatures: true, // Possiamo testare nuove feature
    },
  },
  staging: {
    name: 'staging',
    displayName: 'Staging',
    apiUrl: 'https://staging-api.example.com',
    debugMode: true,
    logLevel: 'info',
    features: {
      analytics: true,            // Testiamo analytics
      errorReporting: true,       // Catturiamo errori
      experimentalFeatures: true, // Testiamo nuove feature
    },
  },
  production: {
    name: 'production',
    displayName: 'Production',
    apiUrl: 'https://api.example.com',
    debugMode: false,
    logLevel: 'error',
    features: {
      analytics: true,            // Tracking attivo
      errorReporting: true,       // Sentry, etc.
      experimentalFeatures: false, // Solo feature stabili
    },
  },
};

export const getConfig = (): EnvironmentConfig => {
  return configs[getCurrentEnvironment()];
};

export const config = getConfig();
