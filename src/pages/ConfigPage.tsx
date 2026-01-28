import ConfigExplainer from '@/components/ConfigExplainer';
import { Settings, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConfigPage = () => {
  return (
    <div className="space-y-6">
      {/* Header animato */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Configurazione</h1>
        </div>
        <p className="text-muted-foreground">
          Visualizza i valori di configurazione caricati per l'ambiente corrente.
        </p>
      </div>

      {/* Breadcrumb / Navigator */}
      <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <Link 
          to="/why-not-hardcode"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Perché non Hardcodare</span>
        </Link>
        <Link 
          to="/feature-flags"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <span>Feature Flags</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Main content */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <ConfigExplainer />
      </div>

      {/* Suggerimento */}
      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-sm text-muted-foreground">
          💡 <strong className="text-foreground">Prova:</strong> Vai al{' '}
          <Link to="/simulator" className="text-primary hover:underline">Simulatore Ambiente</Link>
          {' '}e cambia ambiente per vedere come cambiano questi valori!
        </p>
      </div>
    </div>
  );
};

export default ConfigPage;
