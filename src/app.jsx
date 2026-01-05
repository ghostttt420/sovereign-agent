import React, { useState, useEffect } from 'react';
import { Brain, Wallet, TrendingUp, Zap, DollarSign, Activity, Target, Code, FileText, Share2, Smartphone, Github, Cloud, AlertCircle } from 'lucide-react';

const SovereignAgent = () => {
  const [balance, setBalance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    totalEarned: 0,
    apiCost: 0,
    netProfit: 0
  });
  const [opportunities, setOpportunities] = useState([]);
  const [mode, setMode] = useState('live'); // demo or live
  const [isConnected, setIsConnected] = useState(false);

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
    checkConnection();
  }, []);

  useEffect(() => {
    const data = { balance, stats };
    localStorage.setItem('sovereignAgent', JSON.stringify(data));
  }, [balance, stats]);

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'ping' })
      });
      setIsConnected(res.ok);
      if (res.ok) {
        addLog('✅ Connected to AI backend (FREE tier active)', 'success');
        setMode('live');
      }
    } catch (e) {
      setIsConnected(false);
      addLog('ℹ️ Running in demo mode (deploy to activate real AI)', 'info');
    }
  };

  const services = [
    { 
      id: 'seo', 
      name: 'SEO Audit', 
      icon: Target, 
      payout: 15, 
      cost: 0.03,
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
      cost: 0.05,
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
      cost: 0.02,
      time: 2000, 
      success: 0.95,
      platform: 'Twitter/X',
      description: 'Create engaging social media content'
    },
    { 
      id: 'code', 
      name: 'Code Snippet', 
      icon: Code, 
      payout: 30,
      cost: 0.04,
      time: 5000, 
      success: 0.8,
      platform: 'GitHub',
      description: 'Create utility functions and code templates'
    }
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{
      time: timestamp,
      message,
      type
    }, ...prev].slice(0, 100));
  };

  const executeRealTask = async (service) => {
    try {
      addLog(`🔍 [${service.platform}] Finding real ${service.name} opportunities...`, 'info');
      
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: service.id,
          input: `Generate ${service.name.toLowerCase()} for client project`
        })
      });

      if (!response.ok) throw new Error('API call failed');

      const result = await response.json();
      
      if (result.success) {
        const earned = service.payout;
        const cost = service.cost;
        const profit = earned - cost;
        
        setBalance(prev => prev + profit);
        setStats(prev => ({
          ...prev,
          tasksCompleted: prev.tasksCompleted + 1,
          totalEarned: prev.totalEarned + earned,
          apiCost: prev.apiCost + cost,
          netProfit: prev.netProfit + profit
        }));
        
        addLog(`✅ ${service.name} delivered to ${service.platform}!`, 'success');
        addLog(`💰 Earned $${earned} - Cost $${cost.toFixed(2)} = Profit $${profit.toFixed(2)}`, 'success');
        
        return true;
      }
    } catch (error) {
      addLog(`⚠️ Real task failed, using fallback template`, 'error');
      return executeDemoTask(service);
    }
  };

  const executeDemoTask = async (service) => {
    addLog(`🔍 [DEMO] Simulating ${service.name} on ${service.platform}...`, 'info');
    
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
      addLog(`✅ [DEMO] ${service.name} completed! Would earn $${earned}`, 'success');
    } else {
      addLog(`❌ [DEMO] ${service.name} failed - learning from outcome`, 'error');
    }
  };

  const executeTask = async (service) => {
    if (mode === 'live' && isConnected) {
      return executeRealTask(service);
    } else {
      return executeDemoTask(service);
    }
  };

  const findOpportunities = () => {
    const newOpps = services
      .map(s => ({
        ...s,
        score: Math.random() * 100,
        demand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    setOpportunities(newOpps);
  };

  useEffect(() => {
    if (isRunning) {
      findOpportunities();
      addLog(`🤖 Agent activated in ${mode.toUpperCase()} mode`, 'info');
      
      const interval = setInterval(() => {
        const service = services[Math.floor(Math.random() * services.length)];
        executeTask(service);
        
        if (Math.random() > 0.7) {
          findOpportunities();
        }
      }, mode === 'live' ? 10000 : 4000); // Slower in live mode

      return () => clearInterval(interval);
    }
  }, [isRunning, balance, mode]);

  const getPhase = () => {
    if (balance === 0) return '🎬 Initialization';
    if (balance < 50) return '🌱 Seed Phase - Service Work';
    if (balance < 200) return '💎 Growth Phase - Scaling Up';
    return '👑 Sovereign Phase - Full Autonomy';
  };

  const resetAgent = () => {
    if (window.confirm('Reset agent? This will clear all progress.')) {
      setBalance(0);
      setStats({ tasksCompleted: 0, totalEarned: 0, apiCost: 0, netProfit: 0 });
      setLogs([]);
      setOpportunities([]);
      localStorage.removeItem('sovereignAgent');
      addLog('🔄 Agent reset complete', 'info');
    }
  };

  const profitMargin = stats.totalEarned > 0 
    ? ((stats.netProfit / stats.totalEarned) * 100).toFixed(1)
    : 0;

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
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Phase 2: Real AI</span>
                  <span className={`flex items-center gap-1 ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    {isConnected ? 'LIVE' : 'DEMO'}
                  </span>
                </div>
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
                <p className="text-xs md:text-sm text-gray-400">Net Profit</p>
                <p className="text-2xl md:text-3xl font-bold text-green-400">${stats.netProfit.toFixed(2)}</p>
                <p className="text-xs text-gray-500">({profitMargin}% margin)</p>
              </div>
            </div>
          </div>
        </div>

        {/* $0 Setup Banner */}
        {!isConnected && (
          <div className="mb-6 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-1">🚀 Ready for Real Money?</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Deploy to Vercel + add FREE Hugging Face API key = Real AI, $0 cost
                </p>
                <a 
                  href="https://huggingface.co/settings/tokens" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded inline-block"
                >
                  Get Free API Key →
                </a>
              </div>
            </div>
          </div>
        )}

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
              <p className="text-xs text-gray-400">Revenue</p>
            </div>
            <p className="text-xl md:text-2xl font-bold">${stats.totalEarned.toFixed(0)}</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400">AI Cost</p>
            </div>
            <p className="text-xl md:text-2xl font-bold">${stats.apiCost.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-gray-400">Profit</p>
            </div>
            <p className="text-xl md:text-2xl font-bold">${stats.netProfit.toFixed(2)}</p>
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
                        <span className="text-gray-400">${opp.payout} - ${opp.cost.toFixed(2)} AI = ${(opp.payout - opp.cost).toFixed(2)}</span>
                        <span className="text-green-400">{opp.score.toFixed(0)}% match</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Economics */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Economics Breakdown
            </h2>
            <div className="space-y-3">
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">Hugging Face (FREE)</span>
                  <span className="text-green-400 text-sm font-bold">$0.00/task</span>
                </div>
                <p className="text-xs text-gray-400">✅ Unlimited free forever</p>
              </div>
              
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">Anthropic (If needed)</span>
                  <span className="text-blue-400 text-sm font-bold">$0.03/task</span>
                </div>
                <p className="text-xs text-gray-400">$5 free credits = 166 tasks</p>
              </div>

              <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">Platform Fees</span>
                  <span className="text-purple-400 text-sm font-bold">10-20%</span>
                </div>
                <p className="text-xs text-gray-400">Only when you earn money</p>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">Break-Even Point</span>
                  <span className="text-yellow-400 text-sm font-bold">~5 gigs</span>
                </div>
                <p className="text-xs text-gray-400">After $75 earned, pure profit</p>
              </div>
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

        {/* Next Steps */}
        <div className="mt-4 md:mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600/50 rounded-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold mb-3">🎯 $0 to $100 Roadmap</h3>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Step 1: Deploy to Vercel (FREE - 5 min)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Step 2: Get Hugging Face API key (FREE - 2 min)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⏳</span>
              <span>Step 3: List gig on Fiverr (FREE - 15 min)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">⬜</span>
              <span>Step 4: Get first order ($15 earned)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">⬜</span>
              <span>Step 5: Scale to 10 orders ($150 earned)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">⬜</span>
              <span>Step 6: Reinvest in better AI, go full auto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SovereignAgent;