import EnvironmentBadge from './EnvironmentBadge';
import { Settings, Github, BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass-card border-b border-border/50 sticky top-0 z-50 animate-fade-up">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                <Settings className="w-5 h-5 text-primary-foreground animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Environment Manager</h1>
                <p className="text-xs text-muted-foreground">Gestione Configurazioni</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <EnvironmentBadge />
            
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://vitejs.dev/guide/env-and-mode.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                title="Vite Environment Variables"
              >
                <BookOpen className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
