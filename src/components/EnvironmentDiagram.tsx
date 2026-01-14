import { getCurrentEnvironment } from '@/config/environment';
import { Server, Beaker, Rocket, ArrowRight, Database, Cloud, Shield } from 'lucide-react';

const EnvironmentDiagram = () => {
  const currentEnv = getCurrentEnvironment();

  const environments = [
    {
      id: 'development',
      name: 'Development',
      icon: Server,
      description: 'Ambiente locale degli sviluppatori',
      features: ['Hot reload', 'Debug attivo', 'Mock data'],
      color: 'primary',
    },
    {
      id: 'staging',
      name: 'Staging',
      icon: Beaker,
      description: 'Test pre-produzione',
      features: ['Test E2E', 'Dati simulati', 'CI/CD'],
      color: 'warning',
    },
    {
      id: 'production',
      name: 'Production',
      icon: Rocket,
      description: 'Ambiente live per gli utenti',
      features: ['Monitoring', 'Scaling', 'Backup'],
      color: 'success',
    },
  ];

  return (
    <div className="glass-card p-6 animate-fade-up-delay-3">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/20 glow-accent">
          <Cloud className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold gradient-text">Pipeline degli Ambienti</h2>
          <p className="text-sm text-muted-foreground">
            Flusso tipico dal development alla production
          </p>
        </div>
      </div>

      {/* Environment pipeline */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0 mb-8">
        {environments.map((env, index) => (
          <div key={env.id} className="flex flex-col lg:flex-row items-center flex-1">
            <div
              className={`diagram-node flex-1 w-full relative ${
                currentEnv === env.id ? 'gradient-border ring-2 ring-primary/50' : ''
              }`}
            >
              {currentEnv === env.id && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Attivo
                </div>
              )}
              
              <div className={`p-3 rounded-full bg-${env.color}/20 w-fit mx-auto mb-3`}>
                <env.icon className={`w-6 h-6 text-${env.color}`} />
              </div>
              
              <h3 className="font-semibold text-foreground mb-1">{env.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{env.description}</p>
              
              <div className="flex flex-wrap justify-center gap-1">
                {env.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {index < environments.length - 1 && (
              <div className="flex items-center justify-center p-4">
                <ArrowRight className="w-6 h-6 text-primary animate-pulse hidden lg:block" />
                <ArrowRight className="w-6 h-6 text-primary animate-pulse rotate-90 lg:hidden" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Infrastructure diagram */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Componenti Infrastruttura
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Database, label: 'Database', desc: 'PostgreSQL/MongoDB' },
            { icon: Cloud, label: 'CDN', desc: 'Asset delivery' },
            { icon: Shield, label: 'Auth', desc: 'Autenticazione' },
            { icon: Server, label: 'API', desc: 'Backend services' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-lg bg-muted/30 border border-border text-center hover:bg-muted/50 transition-colors"
            >
              <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Config flow explanation */}
      <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
        <p className="text-sm text-muted-foreground">
          <span className="text-accent font-medium">🔄 Flusso:</span> Le variabili d'ambiente vengono 
          iniettate durante il build/deploy. Ogni ambiente ha il suo file <code className="font-mono text-accent">.env</code> con 
          configurazioni specifiche che non entrano nel repository.
        </p>
      </div>
    </div>
  );
};

export default EnvironmentDiagram;
