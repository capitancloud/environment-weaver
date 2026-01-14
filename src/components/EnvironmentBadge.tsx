import { getCurrentEnvironment, type Environment } from '@/config/environment';
import { Server, Beaker, Rocket } from 'lucide-react';

/**
 * Badge che mostra l'ambiente corrente
 * Utile per evitare confusione su quale ambiente si sta visualizzando
 */
const EnvironmentBadge = () => {
  const environment = getCurrentEnvironment();
  
  const envConfig: Record<Environment, { 
    icon: typeof Server; 
    className: string; 
    label: string;
  }> = {
    development: {
      icon: Server,
      className: 'env-development',
      label: 'Development',
    },
    staging: {
      icon: Beaker,
      className: 'env-staging',
      label: 'Staging',
    },
    production: {
      icon: Rocket,
      className: 'env-production',
      label: 'Production',
    },
  };

  const { icon: Icon, className, label } = envConfig[environment];

  return (
    <div className={`env-badge ${className} inline-flex items-center gap-2 animate-pulse-glow`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
  );
};

export default EnvironmentBadge;
