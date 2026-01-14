import Header from '@/components/Header';
import WhyNotHardcode from '@/components/WhyNotHardcode';
import ConfigExplainer from '@/components/ConfigExplainer';
import FeatureFlagsPanel from '@/components/FeatureFlagsPanel';
import EnvironmentDiagram from '@/components/EnvironmentDiagram';
import EnvironmentSimulator from '@/components/EnvironmentSimulator';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';

const Index = () => {
  return (
    <EnvironmentProvider>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero section */}
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Environment Manager</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un'applicazione didattica per comprendere la gestione degli ambienti, 
              le variabili di configurazione e i feature flags nello sviluppo software.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid gap-6 lg:gap-8">
            {/* Environment Simulator - NEW */}
            <EnvironmentSimulator />
            
            {/* Why not hardcode */}
            <WhyNotHardcode />
            
            {/* Two column layout for config and flags */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ConfigExplainer />
              <FeatureFlagsPanel />
            </div>
            
            {/* Environment diagram - full width */}
            <EnvironmentDiagram />
          </div>

          {/* Footer note */}
          <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-up">
            <p>
              💡 Questo progetto è un esercizio didattico. In produzione, usa strumenti come{' '}
              <a href="https://www.dotenv.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                dotenv
              </a>{' '}
              o servizi come{' '}
              <a href="https://launchdarkly.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                LaunchDarkly
              </a>{' '}
              per la gestione avanzata.
            </p>
          </footer>
        </main>
      </div>
    </EnvironmentProvider>
  );
};

export default Index;
