import { config } from '@/config/environment';
import { Code, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ConfigExplainer = () => {
  return (
    <div className="glass-card p-6 animate-fade-up-delay-1">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20 glow-primary">
          <Code className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold gradient-text">Configurazione Corrente</h2>
          <p className="text-sm text-muted-foreground">
            Valori caricati per l'ambiente attivo
          </p>
        </div>
      </div>

      {/* Config values */}
      <div className="space-y-3 mb-6">
        <ConfigRow label="API URL" value={config.apiUrl} />
        <ConfigRow 
          label="Debug Mode" 
          value={config.debugMode ? 'Attivo' : 'Disattivo'} 
          isBoolean 
          boolValue={config.debugMode}
        />
        <ConfigRow label="Log Level" value={config.logLevel} />
        <ConfigRow 
          label="Analytics" 
          value={config.features.analytics ? 'Attivo' : 'Disattivo'} 
          isBoolean 
          boolValue={config.features.analytics}
        />
        <ConfigRow 
          label="Error Reporting" 
          value={config.features.errorReporting ? 'Attivo' : 'Disattivo'} 
          isBoolean 
          boolValue={config.features.errorReporting}
        />
        <ConfigRow 
          label="Experimental Features" 
          value={config.features.experimentalFeatures ? 'Attivo' : 'Disattivo'} 
          isBoolean 
          boolValue={config.features.experimentalFeatures}
        />
      </div>

      {/* Bad vs Good example */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Bad example */}
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 mb-3 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium text-sm">❌ Da evitare</span>
          </div>
          <div className="code-block text-xs">
            <span className="code-comment">// Hardcoded - PERICOLOSO!</span>
            <br />
            <span className="code-keyword">const</span> <span className="code-variable">apiKey</span> = <span className="code-string">"sk_live_abc123"</span>;
            <br />
            <span className="code-keyword">const</span> <span className="code-variable">dbUrl</span> = <span className="code-string">"postgres://..."</span>;
          </div>
        </div>

        {/* Good example */}
        <div className="p-4 rounded-lg bg-success/10 border border-success/30">
          <div className="flex items-center gap-2 mb-3 text-success">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium text-sm">✓ Corretto</span>
          </div>
          <div className="code-block text-xs">
            <span className="code-comment">// Variabili d'ambiente</span>
            <br />
            <span className="code-keyword">const</span> <span className="code-variable">apiKey</span> = process.env.<span className="code-variable">API_KEY</span>;
            <br />
            <span className="code-keyword">const</span> <span className="code-variable">dbUrl</span> = import.meta.env.<span className="code-variable">VITE_DB</span>;
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex gap-2">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">In Vite:</span> usa <code className="font-mono text-primary">import.meta.env.VITE_*</code> per 
            variabili esposte al frontend. Le variabili senza prefisso <code className="font-mono">VITE_</code> non 
            sono accessibili nel browser per sicurezza.
          </p>
        </div>
      </div>
    </div>
  );
};

const ConfigRow = ({ 
  label, 
  value, 
  isBoolean = false, 
  boolValue = false 
}: { 
  label: string; 
  value: string; 
  isBoolean?: boolean; 
  boolValue?: boolean;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
    <span className="text-sm text-muted-foreground">{label}</span>
    {isBoolean ? (
      <span className={`text-sm font-mono ${boolValue ? 'text-success' : 'text-muted-foreground'}`}>
        {value}
      </span>
    ) : (
      <code className="text-sm font-mono text-primary">{value}</code>
    )}
  </div>
);

export default ConfigExplainer;
