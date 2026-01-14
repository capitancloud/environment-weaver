import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, Code, TestTube, Package, Rocket, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

/**
 * CICDDiagram - Diagramma animato del flusso CI/CD
 * 
 * Questo componente visualizza le fasi tipiche di una pipeline CI/CD:
 * 1. Commit - Lo sviluppatore committa il codice
 * 2. Build - Il codice viene compilato
 * 3. Test - Vengono eseguiti i test automatici
 * 4. Package - L'applicazione viene pacchettizzata
 * 5. Deploy - Deployment all'ambiente target
 * 6. Monitor - Monitoraggio post-deployment
 * 
 * Il diagramma si anima mostrando il flusso dei dati attraverso le fasi
 */

interface PipelineStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  duration: string;
  color: string;
}

const stages: PipelineStage[] = [
  {
    id: 'commit',
    name: 'Commit',
    icon: <GitBranch className="w-6 h-6" />,
    description: 'Push del codice al repository',
    duration: '~1s',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'build',
    name: 'Build',
    icon: <Code className="w-6 h-6" />,
    description: 'Compilazione e bundling',
    duration: '~2min',
    color: 'from-cyan-500 to-teal-500'
  },
  {
    id: 'test',
    name: 'Test',
    icon: <TestTube className="w-6 h-6" />,
    description: 'Unit, Integration, E2E tests',
    duration: '~5min',
    color: 'from-teal-500 to-green-500'
  },
  {
    id: 'package',
    name: 'Package',
    icon: <Package className="w-6 h-6" />,
    description: 'Creazione artifact/container',
    duration: '~1min',
    color: 'from-green-500 to-yellow-500'
  },
  {
    id: 'deploy',
    name: 'Deploy',
    icon: <Rocket className="w-6 h-6" />,
    description: 'Deployment all\'ambiente',
    duration: '~2min',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'monitor',
    name: 'Monitor',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'Health check e monitoring',
    duration: 'ongoing',
    color: 'from-orange-500 to-pink-500'
  }
];

const CICDDiagram = () => {
  const { currentEnvironment } = useEnvironment();
  const [activeStage, setActiveStage] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  // Animazione automatica della pipeline
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => {
        const next = (prev + 1) % stages.length;
        if (next === 0) {
          setCompletedStages([]);
        } else {
          setCompletedStages((completed) => [...completed, prev]);
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const getEnvironmentBranch = () => {
    switch (currentEnvironment) {
      case 'development':
        return { branch: 'feature/*', target: 'Dev Server' };
      case 'staging':
        return { branch: 'develop', target: 'Staging Server' };
      case 'production':
        return { branch: 'main', target: 'Production Server' };
    }
  };

  const envInfo = getEnvironmentBranch();

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <span>Pipeline CI/CD</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({envInfo.branch} → {envInfo.target})
            </span>
          </CardTitle>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isRunning 
                ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' 
                : 'bg-success/20 text-success hover:bg-success/30'
            }`}
          >
            {isRunning ? '⏸ Pausa' : '▶ Avvia'}
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Pipeline Flow - Desktop */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between gap-2">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center flex-1">
                {/* Stage Card */}
                <div 
                  className={`
                    relative flex-1 p-4 rounded-xl border transition-all duration-500
                    ${activeStage === index 
                      ? 'border-primary bg-primary/10 scale-105 shadow-lg shadow-primary/20' 
                      : completedStages.includes(index)
                        ? 'border-success/50 bg-success/5'
                        : 'border-white/10 bg-white/5'
                    }
                  `}
                >
                  {/* Pulse animation for active stage */}
                  {activeStage === index && (
                    <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse" />
                  )}
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div 
                      className={`
                        w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
                        bg-gradient-to-br ${stage.color}
                        ${activeStage === index ? 'animate-bounce' : ''}
                        ${completedStages.includes(index) ? 'opacity-100' : 'opacity-70'}
                      `}
                    >
                      {completedStages.includes(index) ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <div className="text-white">{stage.icon}</div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <h4 className="text-center font-semibold text-sm mb-1">{stage.name}</h4>
                    <p className="text-center text-xs text-muted-foreground mb-2 line-clamp-2">
                      {stage.description}
                    </p>
                    <p className="text-center text-xs font-mono text-primary/70">
                      {stage.duration}
                    </p>
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`
                    absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
                    ${activeStage === index 
                      ? 'bg-primary animate-ping' 
                      : completedStages.includes(index)
                        ? 'bg-success'
                        : 'bg-muted'
                    }
                  `} />
                </div>
                
                {/* Arrow between stages */}
                {index < stages.length - 1 && (
                  <div className="px-2 flex-shrink-0">
                    <ArrowRight 
                      className={`w-5 h-5 transition-all duration-300 ${
                        completedStages.includes(index) 
                          ? 'text-success' 
                          : activeStage === index 
                            ? 'text-primary animate-pulse' 
                            : 'text-muted-foreground/30'
                      }`} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Flow - Mobile */}
        <div className="lg:hidden space-y-3">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative">
              <div 
                className={`
                  flex items-center gap-4 p-4 rounded-xl border transition-all duration-500
                  ${activeStage === index 
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                    : completedStages.includes(index)
                      ? 'border-success/50 bg-success/5'
                      : 'border-white/10 bg-white/5'
                  }
                `}
              >
                {/* Icon */}
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    bg-gradient-to-br ${stage.color}
                    ${activeStage === index ? 'animate-pulse' : ''}
                  `}
                >
                  {completedStages.includes(index) ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <div className="text-white">{stage.icon}</div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{stage.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {stage.description}
                  </p>
                </div>
                
                {/* Duration */}
                <div className="text-xs font-mono text-primary/70 flex-shrink-0">
                  {stage.duration}
                </div>
              </div>
              
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className={`
                  absolute left-6 top-full w-0.5 h-3 -translate-x-1/2
                  ${completedStages.includes(index) ? 'bg-success' : 'bg-muted-foreground/20'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso Pipeline</span>
            <span className="font-mono text-primary">
              {completedStages.length}/{stages.length} completati
            </span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-success transition-all duration-500 rounded-full"
              style={{ width: `${((completedStages.length + (activeStage === completedStages.length ? 0.5 : 0)) / stages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Environment-specific info */}
        <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-white/10">
          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary" />
            Configurazione per {currentEnvironment}
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Branch:</span>
              <p className="font-mono text-primary">{envInfo.branch}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Target:</span>
              <p className="font-mono text-accent">{envInfo.target}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Auto-deploy:</span>
              <p className="font-mono text-success">
                {currentEnvironment === 'production' ? 'No (manual)' : 'Sì'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Approval:</span>
              <p className="font-mono text-warning">
                {currentEnvironment === 'production' ? 'Richiesta' : 'Auto'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CICDDiagram;
