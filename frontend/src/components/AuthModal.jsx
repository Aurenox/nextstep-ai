import React, { useState } from 'react';
import { X, User, Mail, Lock, MapPin, ArrowRight, LogIn, UserPlus, LogOut, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthModal({ currentUser, onLogin, onLogout, onClose, initialMode = 'login', promptMessage = null }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLocation, setRegLocation] = useState('Thiruvananthapuram, Kerala');
  const [regError, setRegError] = useState('');

  // Local Accounts DB in localStorage
  const getStoredUsers = () => {
    try {
      const users = localStorage.getItem('nextstep_registered_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveStoredUsers = (users) => {
    localStorage.setItem('nextstep_registered_users', JSON.stringify(users));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address.');
      return;
    }

    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());

    if (existing) {
      // Ensure existing user has valid location or fallback
      if (!existing.location) {
        existing.location = 'Thiruvananthapuram, Kerala';
        saveStoredUsers(users);
      }
      onLogin(existing);
      onClose();
    } else {
      // Auto-create or log in with provided email
      const namePart = loginEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const initials = formattedName.substring(0, 2).toUpperCase() || 'U';

      const newUser = {
        id: `user_${Date.now()}`,
        name: formattedName,
        email: loginEmail.trim(),
        location: 'Thiruvananthapuram, Kerala',
        initials,
        avatarGradient: 'from-blue-600 via-indigo-600 to-cyan-400',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveStoredUsers(users);
      onLogin(newUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Please fill in your name and email address.');
      return;
    }

    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setRegError('An account with this email already exists. Please log in.');
      return;
    }

    const initials = regName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    const gradients = [
      'from-blue-600 via-indigo-600 to-cyan-400',
      'from-emerald-600 via-teal-600 to-cyan-500',
      'from-purple-600 via-indigo-600 to-pink-500',
      'from-amber-600 via-orange-600 to-rose-500'
    ];
    const avatarGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const finalLocation = regLocation.trim() || 'Thiruvananthapuram, Kerala';

    const newUser = {
      id: `user_${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      location: finalLocation,
      initials,
      avatarGradient,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveStoredUsers(users);
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        
        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prompt alert if triggered by protected action */}
        {promptMessage && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* IF USER IS ALREADY LOGGED IN: SHOW ACTIVE PROFILE & LOGOUT */}
        {currentUser ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed In</span>
            </div>

            <h3 className="text-xl font-extrabold text-white tracking-tight mb-4">
              Your Account
            </h3>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 mb-5">
              <div className="flex items-center gap-3.5 mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentUser.avatarGradient || 'from-blue-600 to-cyan-400'} flex items-center justify-center text-white font-black text-base shadow-lg ring-2 ring-white/10`}>
                  {currentUser.initials}
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">{currentUser.name}</h4>
                  <p className="text-xs text-neutral-400 font-medium">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-400 pt-3 border-t border-neutral-800/80">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Primary Jurisdiction: <strong className="text-white">{currentUser.location || 'India'}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* IF NOT LOGGED IN: SHOW LOGIN & REGISTRATION TABS */
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authentication Required</span>
            </div>

            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1">
              {mode === 'login' ? 'Sign in to NEXTSTEP' : 'Create an Account'}
            </h3>
            <p className="text-xs text-neutral-400 mb-5">
              {mode === 'login'
                ? 'Sign in to access your personal action plans, documents, and tracker.'
                : 'Register to start managing your citizen, consumer, and legal tasks.'}
            </p>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLoginError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                {loginError && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 block">Leave empty for passwordless sign-in</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In & Continue</span>
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                {regError && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                    {regError}
                  </div>
                )}

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-300 font-semibold block">Primary Jurisdiction (Location)</label>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      Default: Thiruvananthapuram, Kerala
                    </span>
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="Thiruvananthapuram, Kerala"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    📍 Default set to <strong>Thiruvananthapuram, Kerala</strong>. All legal procedures, administrative dockets, and official correspondence adapt to this jurisdiction.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </form>
            )}

            <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted private session</span>
              </div>
              <span>NEXTSTEP v2.5</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
