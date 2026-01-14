import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, Users, TrendingUp, BarChart3, Play, RotateCcw, Percent } from 'lucide-react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

/**
 * 🧪 A/B TESTING SIMULATOR
 * 
 * Questo componente simula un sistema di A/B testing reale:
 * - Definisce varianti di un esperimento
 * - Simula l'assegnazione degli utenti alle varianti
 * - Calcola metriche di conversione in tempo reale
 * - Mostra l'importanza del rollout progressivo
 * 
 * In produzione, si userebbero servizi come:
 * - LaunchDarkly
 * - Optimizely
 * - Google Optimize
 * - Amplitude
 */

interface Variant {
  id: string;
  name: string;
  description: string;
  color: string;
  conversionRate: number; // Simulated base conversion rate
}

interface ExperimentResult {
  variantId: string;
  users: number;
  conversions: number;
  conversionRate: number;
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  rolloutPercentage: number;
  variants: Variant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
}

const experiments: Experiment[] = [
  {
    id: 'checkout-button',
    name: 'Checkout Button Color',
    description: 'Test del colore del bottone di checkout per aumentare le conversioni',
    rolloutPercentage: 50,
    status: 'running',
    variants: [
      { id: 'control', name: 'Control (Verde)', description: 'Bottone verde attuale', color: 'bg-green-500', conversionRate: 3.2 },
      { id: 'variant-a', name: 'Variant A (Blu)', description: 'Bottone blu primario', color: 'bg-blue-500', conversionRate: 3.8 },
    ]
  },
  {
    id: 'pricing-display',
    name: 'Pricing Page Layout',
    description: 'Test layout della pagina prezzi: cards vs tabella',
    rolloutPercentage: 25,
    status: 'running',
    variants: [
      { id: 'control', name: 'Cards Layout', description: 'Layout a schede verticali', color: 'bg-purple-500', conversionRate: 2.1 },
      { id: 'variant-a', name: 'Table Layout', description: 'Layout tabellare comparativo', color: 'bg-orange-500', conversionRate: 2.8 },
      { id: 'variant-b', name: 'Horizontal Cards', description: 'Schede orizzontali', color: 'bg-pink-500', conversionRate: 2.4 },
    ]
  },
];

const ABTestingSimulator = () => {
  const { currentEnvironment } = useEnvironment();
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment>(experiments[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [rollout, setRollout] = useState(selectedExperiment.rolloutPercentage);

  // Initialize results
  useEffect(() => {
    setResults(
      selectedExperiment.variants.map(v => ({
        variantId: v.id,
        users: 0,
        conversions: 0,
        conversionRate: 0,
      }))
    );
    setRollout(selectedExperiment.rolloutPercentage);
    setTotalUsers(0);
  }, [selectedExperiment]);

  // Simulation logic
  const simulateUser = useCallback(() => {
    // Check if user is in experiment based on rollout
    const isInExperiment = Math.random() * 100 < rollout;
    
    if (!isInExperiment) return;

    // Assign to random variant
    const variantIndex = Math.floor(Math.random() * selectedExperiment.variants.length);
    const variant = selectedExperiment.variants[variantIndex];
    
    // Simulate conversion based on variant's base rate + some randomness
    const adjustedRate = variant.conversionRate + (Math.random() - 0.5) * 0.5;
    const converted = Math.random() * 100 < adjustedRate;

    setTotalUsers(prev => prev + 1);
    setResults(prev => 
      prev.map(r => {
        if (r.variantId === variant.id) {
          const newUsers = r.users + 1;
          const newConversions = r.conversions + (converted ? 1 : 0);
          return {
            ...r,
            users: newUsers,
            conversions: newConversions,
            conversionRate: (newConversions / newUsers) * 100,
          };
        }
        return r;
      })
    );
  }, [rollout, selectedExperiment]);

  // Auto-simulation
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      // Simulate batch of users
      for (let i = 0; i < 5; i++) {
        simulateUser();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating, simulateUser]);

  const resetSimulation = () => {
    setIsSimulating(false);
    setTotalUsers(0);
    setResults(
      selectedExperiment.variants.map(v => ({
        variantId: v.id,
        users: 0,
        conversions: 0,
        conversionRate: 0,
      }))
    );
  };

  const getWinningVariant = () => {
    if (totalUsers < 100) return null;
    return results.reduce((a, b) => a.conversionRate > b.conversionRate ? a : b);
  };

  const winner = getWinningVariant();

  const getEnvironmentNote = () => {
    switch (currentEnvironment) {
      case 'development':
        return '🔧 In development, i test A/B sono disabilitati per default';
      case 'staging':
        return '🧪 In staging, puoi testare la logica A/B con utenti fake';
      case 'production':
        return '🚀 In production, i test A/B sono attivi con utenti reali';
    }
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
            <FlaskConical className="w-5 h-5 text-accent" />
          </div>
          <span>A/B Testing Simulator</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Simula esperimenti A/B e osserva come le varianti performano con diversi rollout
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Environment Note */}
        <div className="p-3 rounded-lg bg-muted/20 border border-white/10 text-sm">
          {getEnvironmentNote()}
        </div>

        {/* Experiment Selector */}
        <div className="flex flex-wrap gap-3">
          {experiments.map((exp) => (
            <button
              key={exp.id}
              onClick={() => {
                setSelectedExperiment(exp);
                setIsSimulating(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedExperiment.id === exp.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-muted/30 hover:bg-muted/50 border border-white/10'
              }`}
            >
              {exp.name}
            </button>
          ))}
        </div>

        {/* Experiment Info */}
        <div className="p-4 rounded-xl bg-muted/20 border border-white/10">
          <h4 className="font-semibold mb-2">{selectedExperiment.name}</h4>
          <p className="text-sm text-muted-foreground mb-4">{selectedExperiment.description}</p>
          
          {/* Variants Preview */}
          <div className="flex flex-wrap gap-2">
            {selectedExperiment.variants.map((variant) => (
              <div 
                key={variant.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
              >
                <div className={`w-3 h-3 rounded-full ${variant.color}`} />
                <span className="text-xs font-medium">{variant.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rollout Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              Rollout Percentage
            </label>
            <span className="font-mono text-primary text-lg">{rollout}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rollout}
            onChange={(e) => setRollout(Number(e.target.value))}
            className="w-full h-2 bg-muted/30 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-primary/50
              [&::-webkit-slider-thumb]:cursor-pointer
            "
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0% (Nessun utente)</span>
            <span>100% (Tutti gli utenti)</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              isSimulating
                ? 'bg-warning/20 text-warning border border-warning/50'
                : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
            }`}
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-pulse' : ''}`} />
            {isSimulating ? 'Simulazione in corso...' : 'Avvia Simulazione'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-3 rounded-lg font-medium bg-muted/30 hover:bg-muted/50 border border-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/20 border border-white/10 text-center">
            <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold font-mono">{totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Utenti nel test</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/10 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold font-mono">
              {results.reduce((a, b) => a + b.conversions, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Conversioni totali</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/10 text-center">
            <BarChart3 className="w-5 h-5 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold font-mono">
              {totalUsers > 0 
                ? ((results.reduce((a, b) => a + b.conversions, 0) / totalUsers) * 100).toFixed(1)
                : '0.0'}%
            </p>
            <p className="text-xs text-muted-foreground">Tasso medio</p>
          </div>
        </div>

        {/* Variant Results */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Risultati per Variante
          </h4>
          
          {results.map((result, index) => {
            const variant = selectedExperiment.variants.find(v => v.id === result.variantId);
            if (!variant) return null;
            
            const isWinner = winner?.variantId === result.variantId && totalUsers >= 100;
            const maxUsers = Math.max(...results.map(r => r.users), 1);
            
            return (
              <div 
                key={result.variantId}
                className={`p-4 rounded-xl border transition-all ${
                  isWinner 
                    ? 'bg-success/10 border-success/50 shadow-lg shadow-success/20' 
                    : 'bg-muted/20 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${variant.color}`} />
                    <span className="font-medium">{variant.name}</span>
                    {isWinner && (
                      <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium animate-pulse">
                        🏆 Winner
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono">
                      {result.conversionRate.toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.conversions}/{result.users} conversioni
                    </p>
                  </div>
                </div>
                
                {/* Progress bars */}
                <div className="space-y-2">
                  <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 ${variant.color} transition-all duration-300`}
                      style={{ width: `${(result.users / maxUsers) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{result.users.toLocaleString()} utenti</span>
                    <span>Base rate: {variant.conversionRate}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistical Significance Note */}
        {totalUsers > 0 && totalUsers < 100 && (
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm text-warning">
            ⚠️ Campione insufficiente ({totalUsers}/100 utenti minimi per significatività statistica)
          </div>
        )}
        
        {totalUsers >= 100 && winner && (
          <div className="p-4 rounded-lg bg-success/10 border border-success/30 text-sm">
            <p className="font-semibold text-success mb-1">✅ Risultato statisticamente significativo</p>
            <p className="text-muted-foreground">
              La variante <strong>{selectedExperiment.variants.find(v => v.id === winner.variantId)?.name}</strong> sta 
              performando meglio con un tasso di conversione del <strong>{winner.conversionRate.toFixed(2)}%</strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ABTestingSimulator;
