import { getAllFeatureFlags } from '@/config/featureFlags';
import { getCurrentEnvironment } from '@/config/environment';
import { User, Flag, Users, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FeatureFlagsPanel = () => {
  const flags = getAllFeatureFlags();
  const currentEnv = getCurrentEnvironment();

  return (
    <div className="glass-card p-6 animate-fade-up-delay-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/20 glow-accent">
          <Flag className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold gradient-text">Feature Flags</h2>
          <p className="text-sm text-muted-foreground">
            Stato in ambiente: <span className="text-primary">{currentEnv}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {flags.map((flag, index) => (
          <div
            key={flag.id}
            className="glass-card p-4 transition-all duration-300 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground">{flag.name}</h3>
                  <Badge
                    variant={flag.currentlyEnabled ? 'default' : 'secondary'}
                    className={flag.currentlyEnabled ? 'bg-success/20 text-success border-success/30' : ''}
                  >
                    {flag.currentlyEnabled ? 'Attivo' : 'Disattivato'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{flag.description}</p>
                
                {/* Stato per ambiente */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.entries(flag.enabled).map(([env, enabled]) => (
                    <span
                      key={env}
                      className={`text-xs px-2 py-1 rounded-md ${
                        enabled
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      {env}: {enabled ? '✓' : '✗'}
                    </span>
                  ))}
                </div>

                {/* Rollout percentage */}
                {flag.rolloutPercentage !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Rollout: {flag.rolloutPercentage}%</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-32">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${flag.rolloutPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {flag.metadata && (
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                    {flag.metadata.owner && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {flag.metadata.owner}
                      </span>
                    )}
                    {flag.metadata.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {flag.metadata.createdAt}
                      </span>
                    )}
                    {flag.metadata.jiraTicket && (
                      <span className="flex items-center gap-1 text-primary">
                        <ExternalLink className="w-3 h-3" />
                        {flag.metadata.jiraTicket}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Toggle visivo */}
              <div
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                  flag.currentlyEnabled
                    ? 'bg-success glow-success'
                    : 'bg-muted'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-foreground transition-all duration-300 ${
                    flag.currentlyEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nota educativa */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">💡 Nota:</span> I feature flags permettono di 
          controllare le funzionalità senza modificare il codice. Ideali per A/B testing, 
          rilasci graduali e kill switch di emergenza.
        </p>
      </div>
    </div>
  );
};

export default FeatureFlagsPanel;
