import React, { useState, useEffect } from 'react';
import { 
  Layers, Compass, ArrowRight, ShieldCheck, ChevronDown, Zap, User 
} from 'lucide-react';

export default function Navbar({ 
  onOpenProcesses, 
  onSelectScenario, 
  onReset, 
  activeProcessCount = 1, 
  currentView = 'landing', 
  currentUser, 
  onOpenAuth 
}) {
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(false);

  useEffect(() => {
    async function fetchAccount() {
      try {
        setLoadingAccount(true);
        const res = await fetch('/api/serpapi/account');
        if (res.ok) {
          const data = await res.json();
          setAccountData(data);
        }
      } catch (err) {
        console.error("Failed to load SerpApi account data:", err);
      } finally {
        setLoadingAccount(false);
      }
    }
    fetchAccount();
  }, []);

  const demoScenarios = [
    { id: 'certificate', label: '🎓 Lost University Certificate (KTU Kerala)', tag: 'Education' },
    { id: 'flight', label: '✈️ Flight Cancelled Full Refund (DGCA)', tag: 'Travel' },
    { id: 'business', label: '💼 Start Small Business (MSME Udyam)', tag: 'Business' },
    { id: 'study_abroad', label: '🌍 Study Abroad Visa & Blocked Account', tag: 'Immigration' },
    { id: 'warranty', label: '🛡️ Defective Product Warranty Claim (NCH)', tag: 'Consumer' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/85 border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo - High-End Hex Prism Kinetic Emblem */}
        <div className="flex items-center gap-3.5 cursor-pointer group" onClick={onReset}>
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-[14px] bg-neutral-950 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-transparent to-cyan-400/20" />
              <svg className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#nextstep-gradient)" />
                <defs>
                  <linearGradient id="nextstep-gradient" x1="3" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38bdf8" />
                    <stop offset="0.5" stopColor="#818cf8" />
                    <stop offset="1" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-blue-200 group-hover:to-cyan-300 transition-all">
                NEXT<span className="text-cyan-400">STEP</span>
              </span>
              <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-widest">
                v2.5
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium tracking-wide hidden sm:block">Universal Action Agent</p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Engine & Live Account Status Pill */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-400 font-medium transition cursor-pointer"
              title="Click to view live SerpApi Account quota and usage"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">
                {accountData?.total_searches_left !== undefined 
                  ? `SerpApi: ${accountData.total_searches_left} left` 
                  : 'SerpApi Live'}
              </span>
              <span className="sm:hidden">
                {accountData?.total_searches_left !== undefined ? `${accountData.total_searches_left}` : 'Live'}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-400/80" />
            </button>

            {/* Account Details Popover */}
            {accountOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setAccountOpen(false)}
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">SerpApi Account API</h4>
                      <p className="text-[10px] text-emerald-400 font-medium">Free Live Status Check</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {accountData?.account_status || 'Active'}
                  </span>
                </div>

                {accountData ? (
                  <div className="mt-3 space-y-3">
                    {/* Searches Quota Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-neutral-400">Monthly Searches Left</span>
                        <span className="text-white font-bold">
                          {accountData.total_searches_left} / {accountData.searches_per_month}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{
                            width: `${Math.min(100, (accountData.total_searches_left / (accountData.searches_per_month || 1)) * 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-400">This Month Usage</div>
                        <div className="text-sm font-extrabold text-neutral-200 mt-0.5">
                          {accountData.this_month_usage} <span className="text-[10px] font-normal text-neutral-500">searches</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-400">This Hour Activity</div>
                        <div className="text-sm font-extrabold text-blue-400 mt-0.5">
                          {accountData.this_hour_searches} <span className="text-[10px] font-normal text-neutral-500">calls</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-400">Current Plan</div>
                        <div className="text-xs font-bold text-neutral-200 mt-0.5">
                          {accountData.plan_name || 'Free Plan'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                        <div className="text-[10px] text-neutral-400">Renewal Date</div>
                        <div className="text-xs font-semibold text-neutral-300 mt-0.5">
                          {accountData.plan_renewal_date || 'Active'}
                        </div>
                      </div>
                    </div>

                    {/* Account ID / Email */}
                    <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-[11px]">
                      <div className="text-neutral-400 text-[10px]">Registered Account</div>
                      <div className="text-neutral-300 font-mono truncate">{accountData.account_email}</div>
                      <div className="text-neutral-500 font-mono text-[10px] mt-0.5 truncate">
                        ID: {accountData.account_id}
                      </div>
                    </div>

                    <div className="text-[10px] text-center text-neutral-500 pt-1 border-t border-neutral-800/60 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>SerpApi Account API is free & consumes 0 quota</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-neutral-400">
                    {loadingAccount ? 'Fetching SerpApi account stats...' : 'Configured and active'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Demo Scenarios Dropdown */}
          <div className="relative">
            <button
              onClick={() => setScenarioOpen(!scenarioOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Scenarios</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {scenarioOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setScenarioOpen(false)}
              >
                <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800">
                  Select Live Verified Workflow
                </div>
                <div className="mt-1 space-y-1">
                  {demoScenarios.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        onSelectScenario(sc.id);
                        setScenarioOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-200 hover:bg-blue-600/15 hover:text-blue-300 transition flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2 font-medium">{sc.label}</span>
                      <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:text-blue-400 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* My Processes Tracker Button */}
          <button
            onClick={onOpenProcesses}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">My Processes</span>
            {activeProcessCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center font-bold">
                {activeProcessCount}
              </span>
            )}
          </button>

          {/* Individual User Profile / Login Button */}
          {currentUser ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 transition shadow-sm cursor-pointer group"
              title="View your account or sign out"
            >
              <span className="text-neutral-200 text-xs font-bold max-w-[110px] truncate hidden md:inline">
                {currentUser.name}
              </span>
              <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${currentUser.avatarGradient || 'from-blue-600 via-indigo-600 to-cyan-400'} flex items-center justify-center text-white text-[11px] font-black shadow-md ring-1 ring-white/20 group-hover:scale-105 transition-transform`}>
                {currentUser.initials || 'U'}
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition shadow-sm cursor-pointer"
              title="Log in or create an account"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* New Task Action */}
          {currentView !== 'landing' && (
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ New</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
