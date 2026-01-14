import { ShieldAlert, GitBranch, Wrench, Users } from 'lucide-react';

const WhyNotHardcode = () => {
  const reasons = [
    {
      icon: ShieldAlert,
      title: 'Sicurezza',
      description: 'Le chiavi API nel codice sono visibili a chiunque abbia accesso al repository o al bundle JS.',
      color: 'destructive',
    },
    {
      icon: GitBranch,
      title: 'Flessibilità',
      description: 'Lo stesso codice deve funzionare in development, staging e production con configurazioni diverse.',
      color: 'primary',
    },
    {
      icon: Wrench,
      title: 'Manutenibilità',
      description: 'Cambiare un URL o una chiave richiede solo modificare una variabile, non ricompilare.',
      color: 'warning',
    },
    {
      icon: Users,
      title: 'Collaborazione',
      description: 'Ogni sviluppatore può avere configurazioni locali diverse senza conflitti.',
      color: 'success',
    },
  ];

  return (
    <div className="glass-card p-6 animate-fade-up">
      <h2 className="text-xl font-semibold gradient-text mb-2">
        Perché non hardcodare i valori?
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Comprendere l'importanza delle variabili d'ambiente
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {reasons.map((reason, index) => (
          <div
            key={reason.title}
            className="p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-all duration-300 group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`p-2 rounded-lg bg-${reason.color}/20 w-fit mb-3 group-hover:glow-${reason.color} transition-shadow`}>
              <reason.icon className={`w-5 h-5 text-${reason.color}`} />
            </div>
            <h3 className="font-medium text-foreground mb-1">{reason.title}</h3>
            <p className="text-sm text-muted-foreground">{reason.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyNotHardcode;
