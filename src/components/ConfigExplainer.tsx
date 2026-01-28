import { useState } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { 
  Code, AlertTriangle, CheckCircle, Info, HelpCircle, 
  Server, Bug, BarChart3, Shield, FlaskConical, Zap,
  ChevronDown, Lightbulb
} from 'lucide-react';

interface ConfigItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  example: string;
  getValue: (config: any) => string | boolean;
  isBoolean?: boolean;
}

const configItems: ConfigItem[] = [
  {
    key: 'apiUrl',
    label: 'API URL',
    icon: <Server className="w-4 h-4" />,
    description: "L'indirizzo del server che fornisce i dati all'app. Cambia in base all'ambiente.",
    example: "In development punti al tuo PC (localhost), in production al server vero.",
    getValue: (config) => config.apiUrl,
  },
  {
    key: 'debugMode',
    label: 'Debug Mode',
    icon: <Bug className="w-4 h-4" />,
    description: "Mostra informazioni extra per trovare errori. Solo per sviluppatori!",
    example: "È come il 'dietro le quinte' di un film: utile per chi crea, non per chi guarda.",
    getValue: (config) => config.debugMode,
    isBoolean: true,
  },
  {
    key: 'logLevel',
    label: 'Log Level',
    icon: <Code className="w-4 h-4" />,
    description: "Quanti dettagli salvare nei log. 'debug' = tutto, 'error' = solo problemi gravi.",
    example: "Come il volume della musica: in casa puoi alzarlo, al cinema deve essere perfetto.",
    getValue: (config) => config.logLevel,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    description: "Traccia come gli utenti usano l'app (click, pagine visitate, etc.).",
    example: "Tipo Google Analytics: conta quante persone visitano e cosa fanno.",
    getValue: (config) => config.features.analytics,
    isBoolean: true,
  },
  {
    key: 'errorReporting',
    label: 'Error Reporting',
    icon: <Shield className="w-4 h-4" />,
    description: "Invia automaticamente gli errori a servizi come Sentry per essere notificati.",
    example: "Come un allarme antifurto: ti avvisa appena qualcosa va storto.",
    getValue: (config) => config.features.errorReporting,
    isBoolean: true,
  },
  {
    key: 'experimentalFeatures',
    label: 'Experimental Features',
    icon: <FlaskConical className="w-4 h-4" />,
    description: "Funzioni nuove non ancora pronte per tutti. Potrebbero avere bug!",
    example: "Come la versione beta di un videogioco: puoi provarlo in anteprima.",
    getValue: (config) => config.features.experimentalFeatures,
    isBoolean: true,
  },
];

const ConfigExplainer = () => {
  const { config, currentEnvironment } = useEnvironment();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showCodeExample, setShowCodeExample] = useState(false);

  const toggleExpand = (key: string) => {
    setExpandedItem(expandedItem === key ? null : key);
  };

  return (
    <div className="glass-card p-6 overflow-hidden">
      {/* Header animato */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <div className="p-2 rounded-lg bg-primary/20 glow-primary animate-pulse">
          <Code className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold gradient-text">Configurazione Corrente</h2>
          <p className="text-sm text-muted-foreground">
            Valori caricati per l'ambiente: <span className="text-primary font-medium">{currentEnvironment}</span>
          </p>
        </div>
      </div>

      {/* Spiegazione introduttiva */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex gap-3">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground mb-1 flex items-center gap-2">
              Cosa sono le "configurazioni"?
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </h3>
            <p className="text-sm text-muted-foreground">
              Le <strong className="text-foreground">configurazioni</strong> sono impostazioni che cambiano il comportamento dell'app 
              senza modificare il codice. Ogni ambiente (Dev/Staging/Prod) ha valori diversi!
            </p>
            <p className="text-xs text-accent mt-2">
              👆 Clicca su ogni voce per vedere la spiegazione dettagliata
            </p>
          </div>
        </div>
      </div>

      {/* Config values con animazioni staggered */}
      <div className="space-y-3 mb-6">
        {configItems.map((item, index) => {
          const rawValue = item.getValue(config);
          const isExpanded = expandedItem === item.key;
          const displayValue = item.isBoolean 
            ? (rawValue ? 'Attivo' : 'Disattivo')
            : String(rawValue);
          
          return (
            <div 
              key={item.key}
              className="animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <button
                onClick={() => toggleExpand(item.key)}
                className={`w-full p-4 rounded-xl border transition-all duration-300 text-left group ${
                  isExpanded 
                    ? 'bg-primary/10 border-primary/50 shadow-lg shadow-primary/10' 
                    : 'bg-muted/30 border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isExpanded ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:text-primary'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.isBoolean ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          rawValue 
                            ? 'bg-success shadow-lg shadow-success/50 animate-pulse' 
                            : 'bg-muted-foreground'
                        }`} />
                        <span className={`text-sm font-mono transition-colors ${
                          rawValue ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          {displayValue}
                        </span>
                      </div>
                    ) : (
                      <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                        {displayValue}
                      </code>
                    )}
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
              </button>
              
              {/* Expanded content */}
              <div className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-4 rounded-xl bg-muted/20 border border-border ml-4 border-l-2 border-l-primary">
                  <p className="text-sm text-foreground mb-2">{item.description}</p>
                  <div className="flex items-start gap-2 text-xs text-accent">
                    <span>💡</span>
                    <span className="italic">{item.example}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toggle per esempi di codice */}
      <button
        onClick={() => setShowCodeExample(!showCodeExample)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border transition-all mb-4"
      >
        <Code className="w-4 h-4" />
        <span className="text-sm font-medium">
          {showCodeExample ? 'Nascondi' : 'Mostra'} esempi di codice
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCodeExample ? 'rotate-180' : ''}`} />
      </button>

      {/* Bad vs Good example con animazione */}
      <div className={`overflow-hidden transition-all duration-500 ${
        showCodeExample ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Bad example */}
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 hover:border-destructive/50 transition-all group">
            <div className="flex items-center gap-2 mb-3 text-destructive">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span className="font-medium text-sm">❌ Da evitare</span>
            </div>
            <div className="code-block text-xs font-mono p-3 rounded-lg bg-background/50">
              <div className="text-muted-foreground">// Hardcoded - PERICOLOSO!</div>
              <div className="mt-1">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-cyan-400">apiKey</span>{' '}
                <span className="text-white">=</span>{' '}
                <span className="text-amber-400">"sk_live_abc123"</span>;
              </div>
              <div className="mt-1">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-cyan-400">dbUrl</span>{' '}
                <span className="text-white">=</span>{' '}
                <span className="text-amber-400">"postgres://..."</span>;
              </div>
            </div>
            <p className="text-xs text-destructive/80 mt-3">
              ⚠️ Chiunque veda il codice può rubare queste credenziali!
            </p>
          </div>

          {/* Good example */}
          <div className="p-4 rounded-xl bg-success/10 border border-success/30 hover:border-success/50 transition-all group">
            <div className="flex items-center gap-2 mb-3 text-success">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium text-sm">✓ Corretto</span>
            </div>
            <div className="code-block text-xs font-mono p-3 rounded-lg bg-background/50">
              <div className="text-muted-foreground">// Variabili d'ambiente</div>
              <div className="mt-1">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-cyan-400">apiKey</span>{' '}
                <span className="text-white">=</span>{' '}
                <span className="text-green-400">process.env</span>.<span className="text-amber-400">API_KEY</span>;
              </div>
              <div className="mt-1">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-cyan-400">dbUrl</span>{' '}
                <span className="text-white">=</span>{' '}
                <span className="text-green-400">import.meta.env</span>.<span className="text-amber-400">VITE_DB</span>;
              </div>
            </div>
            <p className="text-xs text-success/80 mt-3">
              ✓ I valori vengono iniettati al momento del deploy, non sono nel codice!
            </p>
          </div>
        </div>

        {/* Come funziona */}
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Come funziona in pratica?
          </h4>
          <ol className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">1.</span>
              <span>Crei un file <code className="text-primary">.env</code> con i valori (es: <code className="text-primary">API_KEY=abc123</code>)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">2.</span>
              <span>Questo file <strong className="text-foreground">non viene committato</strong> in Git (è nel .gitignore)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">3.</span>
              <span>Ogni ambiente (Dev/Staging/Prod) ha il suo file .env con valori diversi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">4.</span>
              <span>Al momento del build, i valori vengono "iniettati" nell'app</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Info box finale */}
      <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">In Vite:</span> usa <code className="font-mono text-primary bg-primary/10 px-1 rounded">import.meta.env.VITE_*</code> per 
              variabili esposte al frontend. Le variabili senza prefisso <code className="font-mono">VITE_</code> non 
              sono accessibili nel browser per sicurezza.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigExplainer;
