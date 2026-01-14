import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Trash2, Pause, Play, AlertCircle, Info, AlertTriangle, Bug } from 'lucide-react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

/**
 * 📋 REAL-TIME LOG VIEWER
 * 
 * Questo componente simula un sistema di logging in tempo reale:
 * - I log vengono filtrati in base al logLevel dell'ambiente
 * - Development: mostra tutti i log (debug, info, warn, error)
 * - Staging: mostra info, warn, error
 * - Production: mostra solo error
 * 
 * In produzione si userebbero servizi come:
 * - Datadog
 * - Sentry
 * - LogRocket
 * - AWS CloudWatch
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source: string;
}

// Sample log messages for simulation
const sampleLogs: Omit<LogEntry, 'id' | 'timestamp'>[] = [
  { level: 'debug', message: 'Component mounted: UserProfile', source: 'React' },
  { level: 'debug', message: 'Fetching user data...', source: 'API' },
  { level: 'info', message: 'User session started', source: 'Auth' },
  { level: 'debug', message: 'Cache hit for /api/products', source: 'Cache' },
  { level: 'info', message: 'Feature flag "dark_mode" evaluated: true', source: 'FeatureFlags' },
  { level: 'warn', message: 'API response time exceeded 500ms', source: 'Performance' },
  { level: 'debug', message: 'Redux action dispatched: SET_USER', source: 'Redux' },
  { level: 'info', message: 'Payment intent created', source: 'Stripe' },
  { level: 'error', message: 'Failed to load user preferences', source: 'API' },
  { level: 'warn', message: 'Deprecated API endpoint used: /v1/users', source: 'API' },
  { level: 'debug', message: 'WebSocket connection established', source: 'Socket' },
  { level: 'info', message: 'A/B test variant assigned: checkout-v2', source: 'Experiments' },
  { level: 'error', message: 'Database connection timeout', source: 'Database' },
  { level: 'debug', message: 'Render cycle completed in 12ms', source: 'React' },
  { level: 'warn', message: 'Memory usage above 80%', source: 'System' },
  { level: 'info', message: 'User clicked CTA button', source: 'Analytics' },
  { level: 'debug', message: 'Image lazy-loaded: hero-banner.jpg', source: 'Performance' },
  { level: 'error', message: 'Unhandled promise rejection in checkout', source: 'JavaScript' },
  { level: 'info', message: 'Email notification queued', source: 'Notifications' },
  { level: 'warn', message: 'Rate limit approaching: 80/100 requests', source: 'API' },
];

const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const logLevelConfig: Record<LogLevel, { icon: React.ReactNode; color: string; bg: string }> = {
  debug: { 
    icon: <Bug className="w-3.5 h-3.5" />, 
    color: 'text-muted-foreground', 
    bg: 'bg-muted/30' 
  },
  info: { 
    icon: <Info className="w-3.5 h-3.5" />, 
    color: 'text-primary', 
    bg: 'bg-primary/10' 
  },
  warn: { 
    icon: <AlertTriangle className="w-3.5 h-3.5" />, 
    color: 'text-warning', 
    bg: 'bg-warning/10' 
  },
  error: { 
    icon: <AlertCircle className="w-3.5 h-3.5" />, 
    color: 'text-destructive', 
    bg: 'bg-destructive/10' 
  },
};

const LogViewer = () => {
  const { currentEnvironment, config } = useEnvironment();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get minimum log level based on environment config
  const minLogLevel = config.logLevel;
  const minPriority = logLevelPriority[minLogLevel];

  // Auto-scroll to bottom
  useEffect(() => {
    if (isStreaming && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isStreaming]);

  // Generate random logs
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...randomLog,
      };
      
      setLogs(prev => [...prev.slice(-50), newLog]); // Keep last 50 logs
    }, 800 + Math.random() * 1200);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Filter logs based on environment log level and user filter
  const filteredLogs = logs.filter(log => {
    const logPriority = logLevelPriority[log.level];
    const passesEnvFilter = logPriority >= minPriority;
    const passesUserFilter = filter === 'all' || log.level === filter;
    return passesEnvFilter && passesUserFilter;
  });

  // Count logs by level
  const logCounts = logs.reduce((acc, log) => {
    if (logLevelPriority[log.level] >= minPriority) {
      acc[log.level] = (acc[log.level] || 0) + 1;
    }
    return acc;
  }, {} as Record<LogLevel, number>);

  const formatTime = (date: Date) => {
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
    }) + `.${ms}`;
  };

  const getLogLevelLabel = () => {
    switch (currentEnvironment) {
      case 'development':
        return { level: 'debug', desc: 'Tutti i log visibili' };
      case 'staging':
        return { level: 'info', desc: 'Debug nascosti' };
      case 'production':
        return { level: 'error', desc: 'Solo errori critici' };
    }
  };

  const levelInfo = getLogLevelLabel();

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Terminal className="w-5 h-5 text-green-400" />
            </div>
            <span>Log Viewer</span>
            <span className="text-xs font-mono px-2 py-1 rounded bg-muted/30 text-muted-foreground">
              {currentEnvironment}
            </span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Log level indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/20 text-xs">
              <span className="text-muted-foreground">Log Level:</span>
              <span className={`font-mono font-bold ${
                levelInfo.level === 'debug' ? 'text-muted-foreground' :
                levelInfo.level === 'info' ? 'text-primary' : 'text-destructive'
              }`}>
                {levelInfo.level.toUpperCase()}
              </span>
            </div>
            
            {/* Controls */}
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`p-2 rounded-lg transition-all ${
                isStreaming 
                  ? 'bg-success/20 text-success' 
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              }`}
              title={isStreaming ? 'Pause' : 'Resume'}
            >
              {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLogs([])}
              className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-all"
              title="Clear logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Environment info */}
        <p className="text-sm text-muted-foreground mt-2">
          {levelInfo.desc} • I log con priorità inferiore a <code className="font-mono text-primary">{minLogLevel}</code> sono filtrati
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-3 border-b border-white/10 bg-muted/10 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            Tutti ({filteredLogs.length})
          </button>
          {(['debug', 'info', 'warn', 'error'] as LogLevel[]).map(level => {
            const isDisabled = logLevelPriority[level] < minPriority;
            const count = logCounts[level] || 0;
            const cfg = logLevelConfig[level];
            
            return (
              <button
                key={level}
                onClick={() => !isDisabled && setFilter(level)}
                disabled={isDisabled}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isDisabled 
                    ? 'opacity-30 cursor-not-allowed' 
                    : filter === level 
                      ? `${cfg.bg} ${cfg.color}` 
                      : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                {cfg.icon}
                <span className="capitalize">{level}</span>
                {!isDisabled && <span>({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Logs container */}
        <div 
          ref={containerRef}
          className="h-72 overflow-y-auto font-mono text-xs bg-background/50"
        >
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Nessun log da visualizzare</p>
                <p className="text-xs mt-1">
                  {isStreaming ? 'In attesa di nuovi log...' : 'Streaming in pausa'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredLogs.map((log) => {
                const cfg = logLevelConfig[log.level];
                return (
                  <div 
                    key={log.id} 
                    className={`flex items-start gap-3 px-4 py-2 hover:bg-white/5 transition-colors animate-fade-in ${cfg.bg}`}
                  >
                    {/* Timestamp */}
                    <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {formatTime(log.timestamp)}
                    </span>
                    
                    {/* Level badge */}
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${cfg.bg} ${cfg.color} flex-shrink-0`}>
                      {cfg.icon}
                      <span className="uppercase w-10">{log.level}</span>
                    </span>
                    
                    {/* Source */}
                    <span className="text-accent flex-shrink-0 w-24 truncate">
                      [{log.source}]
                    </span>
                    
                    {/* Message */}
                    <span className="text-foreground flex-1 break-all">
                      {log.message}
                    </span>
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-muted/10 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} visualizzati
            </span>
            <span className="hidden sm:inline">
              {logs.length - filteredLogs.length} filtrati dall'ambiente
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Live
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogViewer;
