import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  KeyRound, Eye, EyeOff, Shield, AlertTriangle, 
  CheckCircle, Copy, RefreshCw, Lock, Unlock, Info
} from 'lucide-react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

/**
 * 🔐 SECRETS MANAGER SIMULATOR
 * 
 * Questo componente simula un sistema di gestione secrets:
 * - Mostra come le credenziali variano per ambiente
 * - Dimostra il masking dei valori sensibili
 * - Spiega le best practices per la sicurezza
 * 
 * In produzione, si userebbero servizi come:
 * - AWS Secrets Manager
 * - HashiCorp Vault
 * - Azure Key Vault
 * - Doppler
 * - 1Password Secrets Automation
 * 
 * MAI hardcodare secrets nel codice sorgente!
 */

interface Secret {
  key: string;
  label: string;
  category: 'api' | 'database' | 'auth' | 'service';
  values: {
    development: string;
    staging: string;
    production: string;
  };
  isPublic: boolean;
  rotationDays?: number;
  description: string;
}

const secrets: Secret[] = [
  {
    key: 'DATABASE_URL',
    label: 'Database URL',
    category: 'database',
    values: {
      development: 'postgresql://dev:dev123@localhost:5432/app_dev',
      staging: 'postgresql://stage:st4g3_p4ss@staging-db.example.com:5432/app_staging',
      production: 'postgresql://prod:pr0d_s3cr3t@prod-db.example.com:5432/app_prod',
    },
    isPublic: false,
    rotationDays: 90,
    description: 'Connection string per il database PostgreSQL',
  },
  {
    key: 'STRIPE_SECRET_KEY',
    label: 'Stripe Secret Key',
    category: 'api',
    values: {
      development: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
      staging: 'sk_test_51HG8k2EZNxCpT0mN3J5Kv9Rs',
      production: 'sk_live_51HG8k2EZNxCpT0mN3J5Kv9Rs',
    },
    isPublic: false,
    rotationDays: 365,
    description: 'Chiave segreta per API Stripe (pagamenti)',
  },
  {
    key: 'STRIPE_PUBLISHABLE_KEY',
    label: 'Stripe Publishable Key',
    category: 'api',
    values: {
      development: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
      staging: 'pk_test_51HG8k2EZNxCpT0mN3J5Kv9Rs',
      production: 'pk_live_51HG8k2EZNxCpT0mN3J5Kv9Rs',
    },
    isPublic: true,
    description: 'Chiave pubblica Stripe (sicura nel frontend)',
  },
  {
    key: 'JWT_SECRET',
    label: 'JWT Secret',
    category: 'auth',
    values: {
      development: 'dev-jwt-secret-not-for-production',
      staging: 'stg-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      production: 'prd-eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9',
    },
    isPublic: false,
    rotationDays: 30,
    description: 'Secret per firma e verifica JWT tokens',
  },
  {
    key: 'SENDGRID_API_KEY',
    label: 'SendGrid API Key',
    category: 'service',
    values: {
      development: 'SG.dev_key_for_testing_only',
      staging: 'SG.stg_P4ssw0rd_f0r_st4g1ng',
      production: 'SG.prd_S3cur3_K3y_F0r_Pr0d',
    },
    isPublic: false,
    rotationDays: 180,
    description: 'API key per invio email transazionali',
  },
  {
    key: 'REDIS_URL',
    label: 'Redis URL',
    category: 'database',
    values: {
      development: 'redis://localhost:6379',
      staging: 'redis://:st4g3_r3d1s@cache.staging.example.com:6379',
      production: 'redis://:pr0d_r3d1s@cache.prod.example.com:6379',
    },
    isPublic: false,
    rotationDays: 90,
    description: 'URL per connessione cache Redis',
  },
];

const categoryConfig = {
  api: { label: 'API Keys', color: 'text-primary', bg: 'bg-primary/10' },
  database: { label: 'Database', color: 'text-accent', bg: 'bg-accent/10' },
  auth: { label: 'Auth', color: 'text-warning', bg: 'bg-warning/10' },
  service: { label: 'Services', color: 'text-success', bg: 'bg-success/10' },
};

const SecretsManager = () => {
  const { currentEnvironment } = useEnvironment();
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleReveal = (key: string) => {
    setRevealedSecrets(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const copyToClipboard = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskValue = (value: string) => {
    if (value.length <= 8) return '••••••••';
    return value.slice(0, 4) + '••••••••' + value.slice(-4);
  };

  const filteredSecrets = selectedCategory === 'all' 
    ? secrets 
    : secrets.filter(s => s.category === selectedCategory);

  const getDaysUntilRotation = (rotationDays?: number) => {
    if (!rotationDays) return null;
    // Simulate random days until rotation
    const daysLeft = Math.floor(Math.random() * rotationDays);
    return daysLeft;
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <KeyRound className="w-5 h-5 text-yellow-400" />
          </div>
          <span>Secrets Manager</span>
          <span className="text-xs font-mono px-2 py-1 rounded bg-muted/30 text-muted-foreground">
            {currentEnvironment}
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Gestione sicura delle credenziali e API keys per ambiente
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Security warning banner */}
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive text-sm">⚠️ Mai hardcodare i secrets!</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Questa è una <strong>simulazione didattica</strong>. In produzione, usa servizi dedicati 
                come Vault, AWS Secrets Manager o le variabili d'ambiente del tuo hosting.
              </p>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            Tutti ({secrets.length})
          </button>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === key
                  ? `${cfg.bg} ${cfg.color}`
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              {cfg.label} ({secrets.filter(s => s.category === key).length})
            </button>
          ))}
        </div>

        {/* Secrets list */}
        <div className="space-y-3">
          {filteredSecrets.map((secret) => {
            const value = secret.values[currentEnvironment];
            const isRevealed = revealedSecrets.has(secret.key);
            const catConfig = categoryConfig[secret.category];
            const daysLeft = getDaysUntilRotation(secret.rotationDays);
            const needsRotation = daysLeft !== null && daysLeft < 30;
            
            return (
              <div 
                key={secret.key}
                className={`p-4 rounded-xl border transition-all ${
                  needsRotation 
                    ? 'bg-warning/5 border-warning/30' 
                    : 'bg-muted/20 border-white/10'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Key info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${catConfig.bg} ${catConfig.color}`}>
                        {catConfig.label}
                      </span>
                      {secret.isPublic ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-success/10 text-success text-xs">
                          <Unlock className="w-3 h-3" />
                          Pubblica
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs">
                          <Lock className="w-3 h-3" />
                          Privata
                        </span>
                      )}
                      {needsRotation && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-warning/20 text-warning text-xs animate-pulse">
                          <RefreshCw className="w-3 h-3" />
                          Rotazione necessaria
                        </span>
                      )}
                    </div>
                    <h4 className="font-mono font-semibold mt-2">{secret.key}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{secret.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleReveal(secret.key)}
                      className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all"
                      title={isRevealed ? 'Nascondi' : 'Mostra'}
                    >
                      {isRevealed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(secret.key, value)}
                      className={`p-2 rounded-lg transition-all ${
                        copiedKey === secret.key
                          ? 'bg-success/20 text-success'
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                      title="Copia"
                    >
                      {copiedKey === secret.key ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Value display */}
                <div className="mt-3 p-3 rounded-lg bg-background/50 border border-white/5 font-mono text-sm break-all">
                  {isRevealed ? (
                    <span className="text-foreground">{value}</span>
                  ) : (
                    <span className="text-muted-foreground">{maskValue(value)}</span>
                  )}
                </div>

                {/* Rotation info */}
                {secret.rotationDays && (
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Rotazione ogni {secret.rotationDays} giorni</span>
                    {daysLeft !== null && (
                      <span className={needsRotation ? 'text-warning' : ''}>
                        {daysLeft} giorni rimanenti
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Best practices */}
        <div className="p-4 rounded-xl bg-muted/20 border border-white/10">
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            Best Practices per la Sicurezza
          </h4>
          <div className="grid md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>Usa variabili d'ambiente, mai valori nel codice</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>Ruota regolarmente le credenziali sensibili</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>Usa secrets diversi per ogni ambiente</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>Limita l'accesso ai secrets in produzione</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>Monitora l'uso dei secrets per anomalie</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>Non committare mai .env in git</span>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            Le chiavi <strong className="text-foreground">pubbliche</strong> (come Stripe Publishable Key) 
            possono essere esposte nel frontend. Le chiavi <strong className="text-foreground">private</strong> devono 
            restare solo sul server (edge functions, backend).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecretsManager;
