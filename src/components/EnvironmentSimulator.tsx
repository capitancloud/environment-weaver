/**
 * 🎮 ENVIRONMENT SIMULATOR - Simulatore Interattivo
 * 
 * Questo componente permette di cambiare ambiente in tempo reale
 * per vedere come cambiano le configurazioni.
 * 
 * ⚠️ NOTA DIDATTICA:
 * In un'app reale, l'ambiente NON può essere cambiato a runtime!
 * L'ambiente è determinato dalle variabili d'ambiente al momento del build.
 * Questo simulatore esiste solo per scopi educativi.
 */

import { useState } from 'react';
import { Play, Settings, Zap, Server, Code, Shield, BarChart3, Bug, FlaskConical, ArrowRight } from 'lucide-react';
import { useEnvironment, configs } from '@/contexts/EnvironmentContext';
import type { Environment } from '@/config/environment';

const environments: { id: Environment; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'development', label: 'Development', icon: <Code className="w-4 h-4" />, color: 'primary' },
  { id: 'staging', label: 'Staging', icon: <FlaskConical className="w-4 h-4" />, color: 'warning' },
  { id: 'production', label: 'Production', icon: <Server className="w-4 h-4" />, color: 'success' },
];

const EnvironmentSimulator = () => {
  const { currentEnvironment, config, setEnvironment, isSimulated } = useEnvironment();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnvironmentChange = (env: Environment) => {
    if (env === currentEnvironment) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setEnvironment(env);
      setIsTransitioning(false);
    }, 300);
  };

  const getEnvStyles = (env: Environment, isActive: boolean) => {
    const baseStyles = "relative flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer";
    
    if (isActive) {
      switch (env) {
        case 'development':
          return `${baseStyles} bg-primary/20 text-primary border border-primary/50 glow-primary`;
        case 'staging':
          return `${baseStyles} bg-warning/20 text-warning border border-warning/50 glow-warning`;
        case 'production':
          return `${baseStyles} bg-success/20 text-success border border-success/50 glow-success`;
      }
    }
    
    return `${baseStyles} bg-secondary/50 text-muted-foreground border border-border hover:bg-secondary hover:text-foreground`;
  };

  return (
    <div className="glass-card p-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/20">
          <Play className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Simulatore Ambiente</h2>
          <p className="text-sm text-muted-foreground">
            Cambia ambiente e osserva le configurazioni in tempo reale
          </p>
        </div>
        {isSimulated && (
          <span className="ml-auto px-2 py-1 rounded text-xs bg-accent/20 text-accent border border-accent/30">
            Modalità Simulazione
          </span>
        )}
      </div>

      {/* Environment Selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {environments.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => handleEnvironmentChange(id)}
            className={getEnvStyles(id, currentEnvironment === id)}
          >
            {icon}
            <span className="text-sm">{label}</span>
            {currentEnvironment === id && (
              <Zap className="w-3 h-3 absolute top-1 right-1 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Transition indicator */}
      {isTransitioning && (
        <div className="flex items-center justify-center gap-2 py-4 text-accent">
          <Settings className="w-5 h-5 animate-spin" />
          <span className="text-sm">Caricamento configurazione...</span>
        </div>
      )}

      {/* Configuration Display */}
      <div className={`space-y-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-30' : 'opacity-100'}`}>
        {/* API URL */}
        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Server className="w-4 h-4" />
            <span>API URL</span>
          </div>
          <code className="text-sm font-mono text-primary break-all">{config.apiUrl}</code>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Debug Mode */}
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Bug className="w-4 h-4" />
              <span>Debug Mode</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${
              config.debugMode 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {config.debugMode ? 'Attivo' : 'Disattivo'}
            </div>
          </div>

          {/* Log Level */}
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Settings className="w-4 h-4" />
              <span>Log Level</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium uppercase ${
              config.logLevel === 'debug' ? 'bg-primary/20 text-primary' :
              config.logLevel === 'info' ? 'bg-accent/20 text-accent' :
              config.logLevel === 'warn' ? 'bg-warning/20 text-warning' :
              'bg-destructive/20 text-destructive'
            }`}>
              {config.logLevel}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="text-sm text-muted-foreground mb-3">Funzionalità Ambiente</div>
          <div className="grid grid-cols-3 gap-2">
            <FeatureIndicator 
              icon={<BarChart3 className="w-4 h-4" />}
              label="Analytics"
              enabled={config.features.analytics}
            />
            <FeatureIndicator 
              icon={<Shield className="w-4 h-4" />}
              label="Error Reporting"
              enabled={config.features.errorReporting}
            />
            <FeatureIndicator 
              icon={<FlaskConical className="w-4 h-4" />}
              label="Experimental"
              enabled={config.features.experimentalFeatures}
            />
          </div>
        </div>

        {/* Environment Flow */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 via-warning/10 to-success/10 border border-border">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded ${currentEnvironment === 'development' ? 'bg-primary/30 text-primary' : 'text-muted-foreground'}`}>
            <Code className="w-4 h-4" />
            <span className="text-sm">Dev</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded ${currentEnvironment === 'staging' ? 'bg-warning/30 text-warning' : 'text-muted-foreground'}`}>
            <FlaskConical className="w-4 h-4" />
            <span className="text-sm">Staging</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded ${currentEnvironment === 'production' ? 'bg-success/30 text-success' : 'text-muted-foreground'}`}>
            <Server className="w-4 h-4" />
            <span className="text-sm">Prod</span>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="mt-6 p-3 rounded-lg bg-accent/10 border border-accent/20">
        <p className="text-xs text-accent">
          ⚠️ <strong>Nota:</strong> In produzione, l'ambiente è determinato al momento del build 
          tramite variabili d'ambiente (es. <code className="font-mono">VITE_APP_ENV</code>). 
          Non può essere modificato a runtime!
        </p>
      </div>
    </div>
  );
};

const FeatureIndicator = ({ 
  icon, 
  label, 
  enabled 
}: { 
  icon: React.ReactNode; 
  label: string; 
  enabled: boolean;
}) => (
  <div className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
    enabled 
      ? 'bg-success/20 text-success' 
      : 'bg-muted/50 text-muted-foreground'
  }`}>
    {icon}
    <span className="text-xs">{label}</span>
    <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
  </div>
);

export default EnvironmentSimulator;
