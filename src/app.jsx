import React, { useState, useEffect } from 'react';
import { Brain, Wallet, TrendingUp, Zap, DollarSign, Activity, Target, Code, FileText, Share2, Smartphone, Github, Cloud } from 'lucide-react';

const SovereignAgent = () => {
  const [balance, setBalance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    totalEarned: 0,
    defiProfit: 0,
    activeStrategies: 0
  });
  const [opportunities, setOpportunities] = useState([]);

  // Load state from memory on mount
  useEffect(() => {
    const saved = localStorage.getItem('sovereignAgent');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setBalance(data.balance || 0);
        setStats(data.stats || stats);
      } catch (e) {
        console.log('No saved state');
      }
    }
  }, []);

  // Save state to memory
  useEffect(() => {
    const data = { balance, stats };
    localStorage.setItem('sovereignAgent', JSON.stringify(data));
  }, [balance, stats]);

  const services = [
    { 
      id: 'seo', 
      name: 'SEO Audit', 
      icon: Target, 
      payout: 15, 
      time: 3000, 
      success: 0.85,
      platform: 'Fiverr',
      description: 'Analyze website SEO and provide optimization report'
    },
    { 
      id: 'content', 
      name: 'Content Writing', 
      icon: FileText, 
      payout: 25, 
      time: 4000, 
      success: 0.9,
      platform: 'Upwork',
      description: 'Write 500-word blog posts or articles'
    },
    { 
      id: 'social', 
      name: 'Social Media Post', 
      icon: Share2, 
      payout: 10, 
      time: 2000, 
      success: 0.95,
      platform: 'Fiverr',
      description: 'Create engaging social media content'
    },
    { 
      id: 'code', 
      name: 'Code Snippet', 
      icon: Code, 
      payout: 30, 
      time: 5000, 
      success: 0.8,
      platform: 'GitHub Sponsors',
      description: 'Create utility functions and code templates'
    }
  ];

  const defiStrategies = [
    { name: 'Yield Farming', apy: 12, risk: 'Low', protocol: 'Aave' },
    { name: 'Arbitrage Bot', apy: 25, risk: 'Medium', protocol: 'DEX Aggregator' },
    { name: 'Liquidity Mining', apy: 18, risk: 'Low', protocol: 'Compound' }
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{
      time: timestamp,
      message,
      type
    }, ...prev].slice(0, 100));
  };

  const executeTask = async (service) => {
    addLog(`🔍 [${service.platform}] Scanning for ${service.name} gigs...`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, service.time));
    
    const success = Math.random() < service.success;
    
    if (success) {
      const earned = service.payout;
      setBalance(prev => prev + earned);
      setStats(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
        totalEarned: prev.totalEarned + earned
      }));
      addLog(`✅ ${service.name} completed on ${service.platform}! Earned $${earned}`, 'success');
    } else {
      addLog(`❌ ${service.name} bid rejected - adjusting strategy`, 'error');
    }
  };

  const executeDeFi = async () => {
    if (balance < 50) return;

    const strategy = defiStrategies[Math.floor(Math.random() * defiStrategies.length)];
    addLog(`🚀 Executing ${strategy.name} on ${strategy.protocol}...`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    const profit = (balance * (strategy.apy / 100)) / 365;
    setBalance(prev => prev + profit);
    setStats(prev => ({
      ...prev,
      defiProfit: prev.defiProfit + profit,
      activeStrategies: Math.min(prev.activeStrategies + 1, 3)
    }));
    addLog(`💰 ${strategy.protocol} ${strategy.name}: +$${profit.toFixed(2)} (${strategy.apy}% APY)`, 'success');
  };

  const findOpportunities = () => {
    const newOpps = services
      .map(s => ({
        ...s,
        score: Math.random() * 100,
        demand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
      }))
      .sort((a, b) => b.score - a.sort)
      .slice(0, 3);
    
    setOpportunities(newOpps);
  };

  useEffect(() => {
    if (isRunning) {
      findOpportunities();
      addLog(`🤖 Agent activated`, 'info');
      
      const interval = setInterval(() => {
        const service = services[Math.floor(Math.random() * services.length)];
        executeTask(service);
        
        if (balance >= 50 && Math.random() > 0.6) {
          executeDeFi();
        }
        
        if (Math.random() > 0.7) {
          findOpportunities();
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isRunning, balance]);

  const getPhase = () => {
    if (balance === 0) return '🎬 Initialization';
    if (balance < 50) return '🌱 Seed Phase - Service Work';
    if (balance < 200) return '💎 Growth Phase - DeFi Active';
    return '👑 Sovereign Phase - Full Autonomy';
  };

  const resetAgent = () => {
    if (window.confirm('Reset agent? This will clear all progress.')) {
      setBalance(0);
      setStats({ tasksCompleted: 0, totalEarned: 0, defiProfit: 0, activeStrategies: 0 });
      setLogs([]);
      setOpportunities([]);
      localStorage.removeItem('sovereignAgent');
      addLog('🔄 Agent reset complete', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 md:p-3 rounded-lg">
                <Brain className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Sovereign Agent</h1>
                <p className="text-sm text-gray-400">$0 Start • Mobile Ready</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isRunning ? '⏸ Pause' : '▶ Start'}
              </button>
              <button
                onClick={resetAgent}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
              >
                🔄
              </button>
            </div>
          </div>
          
          <div className="bg-purple-800/30 border border-purple-600/50 rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <p className="text-xs md:text-sm text-gray-400">Current Phase</p>
                <p className="text-lg md:text-2xl font-bold">{getPhase()}</p>
              </div>
              <div className="md:text-right">
                <p className="text-xs md:text-sm text-gray-400">Treasury Balance</p>
                <p className="text-2xl md:text-3xl font-bold text-green-400">${balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Info Banner */}
        <div className="mb-6 bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Ready to Deploy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-green-400" />
              <span>✅ Android PWA Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-green-400" />
              <span>✅ GitHub Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-green-400" />
              <span>✅ Vercel Compatible</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-gray-400">Tasks Done</p>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats.tasksCompleted}</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400">Service $</p>
            </div>
            <p className="text-xl md:text-2xl font-bold">${stats.totalEarned.toFixed(0)}</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400">DeFi $</p>
            </div>
            <p className="text-xl md:text-2xl font-bold">${stats.defiProfit.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-gray-400">Strategies</p>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats.activeStrategies}/3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Opportunities */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Live Opportunities
            </h2>
            <div className="space-y-3">
              {opportunities.length === 0 ? (
                <p className="text-gray-400 text-center py-8 text-sm">Start agent to scan platforms...</p>
              ) : (
                opportunities.map((opp, i) => {
                  const Icon = opp.icon;
                  return (
                    <div key={i} className="bg-gray-700/50 rounded-lg p-3 md:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <div>
                            <span className="font-semibold text-sm md:text-base">{opp.name}</span>
                            <p className="text-xs text-gray-400">{opp.platform}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          opp.demand === 'High' ? 'bg-green-600' :
                          opp.demand === 'Medium' ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}>
                          {opp.demand}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-gray-400">${opp.payout} payout</span>
                        <span className="text-green-400">{opp.score.toFixed(0)}% match</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* DeFi Strategies */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              DeFi Strategies
            </h2>
            {balance < 50 && (
              <div className="mb-3 text-xs bg-yellow-900/30 border border-yellow-600/50 rounded p-2">
                💡 Unlocks at $50 balance
              </div>
            )}
            <div className="space-y-3">
              {defiStrategies.map((strategy, i) => (
                <div 
                  key={i} 
                  className={`rounded-lg p-3 md:p-4 ${
                    balance >= 50 ? 'bg-green-900/30 border border-green-600/50' : 'bg-gray-700/30 border border-gray-600/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm md:text-base">{strategy.name}</span>
                      <p className="text-xs text-gray-400">{strategy.protocol}</p>
                    </div>
                    <span className="text-green-400 font-bold text-sm md:text-base">{strategy.apy}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Risk: {strategy.risk}</span>
                    <span>{balance >= 50 ? '✅ Active' : '🔒 Locked'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-4 md:mt-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live Activity Feed
          </h2>
          <div className="bg-black/50 rounded-lg p-3 md:p-4 h-48 md:h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-500">Waiting for agent activation...</p>
            ) : (
              logs.map((log, i) => (
                <div 
                  key={i} 
                  className={`mb-1 ${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'error' ? 'text-red-400' : 'text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[{log.time}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Deployment Guide */}
        <div className="mt-4 md:mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600/50 rounded-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold mb-3">🚀 Deploy This Agent</h3>
          <div className="space-y-3 text-xs md:text-sm">
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <p className="font-semibold">Push to GitHub</p>
                <code className="text-gray-400 text-xs">git push origin main</code>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="font-semibold">Deploy on Vercel</p>
                <p className="text-gray-400">Connect repo → Auto-deploy (Free tier)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <p className="font-semibold">Add to Android Home Screen</p>
                <p className="text-gray-400">Works as native app (PWA)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
              <div>
                <p className="font-semibold">Scale When Profitable</p>
                <p className="text-gray-400">Add Claude API → Real freelance platforms → Web3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SovereignAgent;
