/**
 * 🌍 ENVIRONMENT CONTEXT - Gestione Stato Ambiente
 * 
 * Questo context permette di simulare il cambio di ambiente
 * in tempo reale per scopi didattici.
 * 
 * In un'app reale, l'ambiente viene determinato dalle variabili
 * d'ambiente al momento del build, non può essere cambiato runtime.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Environment } from '@/config/environment';

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
      analytics: false,
      errorReporting: false,
      experimentalFeatures: true,
    },
  },
  staging: {
    name: 'staging',
    displayName: 'Staging',
    apiUrl: 'https://staging-api.example.com',
    debugMode: true,
    logLevel: 'info',
    features: {
      analytics: true,
      errorReporting: true,
      experimentalFeatures: true,
    },
  },
  production: {
    name: 'production',
    displayName: 'Production',
    apiUrl: 'https://api.example.com',
    debugMode: false,
    logLevel: 'error',
    features: {
      analytics: true,
      errorReporting: true,
      experimentalFeatures: false,
    },
  },
};

interface EnvironmentContextType {
  currentEnvironment: Environment;
  config: EnvironmentConfig;
  setEnvironment: (env: Environment) => void;
  isSimulated: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType | null>(null);

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>('development');
  const [isSimulated, setIsSimulated] = useState(false);

  const setEnvironment = useCallback((env: Environment) => {
    setCurrentEnvironment(env);
    setIsSimulated(true);
  }, []);

  const config = configs[currentEnvironment];

  return (
    <EnvironmentContext.Provider value={{ currentEnvironment, config, setEnvironment, isSimulated }}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within EnvironmentProvider');
  }
  return context;
};

export { configs };
