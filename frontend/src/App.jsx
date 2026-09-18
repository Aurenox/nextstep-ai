import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import QuestionModal from './components/QuestionModal';
import ResearchVisualizer from './components/ResearchVisualizer';
import ActionDashboard from './components/ActionDashboard';
import EmailModal from './components/EmailModal';
import DocumentModal from './components/DocumentModal';
import AdaptiveModal from './components/AdaptiveModal';
import ProcessesModal from './components/ProcessesModal';
import AuthModal from './components/AuthModal';
import { getQuestions, executeResearch, listProcesses, getProcess } from './api';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'researching' | 'dashboard'
  const [problemText, setProblemText] = useState('');
  
  // Real User Authentication State (No hardcoded names)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nextstep_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const [userLocation, setUserLocation] = useState(currentUser?.location || 'Thiruvananthapuram, Kerala');
  
  // Questions State
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [remainingCount, setRemainingCount] = useState(0);
  const [collectedAnswers, setCollectedAnswers] = useState({});

  // Active Process & Processes list
  const [activeProcess, setActiveProcess] = useState(null);
  const [allProcesses, setAllProcesses] = useState([]);

  // Modals
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [adaptiveModalOpen, setAdaptiveModalOpen] = useState(false);
  const [processesModalOpen, setProcessesModalOpen] = useState(false);

  // Sync user state and load user's isolated processes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nextstep_current_user', JSON.stringify(currentUser));
      if (currentUser.location) setUserLocation(currentUser.location);

      async function loadSaved() {
        try {
          const procs = await listProcesses(currentUser.id);
          setAllProcesses(procs);
        } catch (err) {
          console.error("Failed to load user processes:", err);
        }
      }
      loadSaved();
    } else {
      setAllProcesses([]);
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('nextstep_current_user', JSON.stringify(user));
    if (user.location) setUserLocation(user.location);

    // Resume pending action if user tried to do something before logging in
    if (pendingAction) {
      if (pendingAction.type === 'problem') {
        proceedProblemSubmission(pendingAction.problem, pendingAction.location, user);
      } else if (pendingAction.type === 'scenario') {
        startResearch(pendingAction.scenarioId, {}, pendingAction.scenarioId, user.id);
      }
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nextstep_current_user');
    setCurrentUser(null);
    setActiveProcess(null);
    setAllProcesses([]);
    setCurrentView('landing');
  };

  // Step 1: User submits problem on landing page
  const handleSubmitProblem = async (problem, location) => {
    if (!currentUser) {
      setPendingAction({ type: 'problem', problem, location });
      setAuthPrompt('Please sign in or create an account to start your action plan.');
      setAuthModalOpen(true);
      return;
    }

    proceedProblemSubmission(problem, location, currentUser);
  };

  const proceedProblemSubmission = async (problem, location, user) => {
    setProblemText(problem);
    const loc = location || user?.location || userLocation;
    if (loc) setUserLocation(loc);

    try {
      // Check if we need clarifying questions
      const qRes = await getQuestions(problem, {});
      if (qRes.questions && qRes.questions.length > 0) {
        setDynamicQuestions(qRes.questions);
        setRemainingCount(qRes.remaining_count);
        setCollectedAnswers({ location: loc });
        setQuestionModalOpen(true);
      } else {
        // No questions needed, proceed straight to research
        startResearch(problem, { location: loc }, null, user?.id);
      }
    } catch (err) {
      console.error("Error evaluating questions:", err);
      startResearch(problem, { location: loc }, null, user?.id);
    }
  };

  // Step 2: User answers follow-up question
  const handleAnswerQuestion = (fieldKey, answerValue) => {
    const updated = { ...collectedAnswers, [fieldKey]: answerValue };
    setCollectedAnswers(updated);

    // If all questions are answered
    const answeredKeys = Object.keys(updated);
    const pendingQuestions = dynamicQuestions.filter(q => !answeredKeys.includes(q.field_key));

    if (pendingQuestions.length === 0) {
      setQuestionModalOpen(false);
      startResearch(problemText, updated, null, currentUser?.id);
    }
  };

  const handleSkipAllQuestions = () => {
    setQuestionModalOpen(false);
    startResearch(problemText, collectedAnswers, null, currentUser?.id);
  };

  // Step 3: Run research with SerpApi and assemble action dashboard
  const startResearch = async (problem, answers, scenarioId = null, userId = null) => {
    setCurrentView('researching');
    const targetUserId = userId || currentUser?.id || 'user_guest';
    try {
      const dashboardData = await executeResearch(problem, answers, scenarioId, targetUserId);
      setActiveProcess(dashboardData);
      
      // Refresh process tracker list for active user
      if (currentUser?.id) {
        const procs = await listProcesses(currentUser.id);
        setAllProcesses(procs);
      }
      
      // Transition to action dashboard
      setTimeout(() => {
        setCurrentView('dashboard');
      }, 1400);
    } catch (err) {
      console.error("Research failed:", err);
      setCurrentView('landing');
    }
  };

  // Handle direct demo scenario launch
  const handleSelectScenario = (scenarioId) => {
    if (!currentUser) {
      setPendingAction({ type: 'scenario', scenarioId });
      setAuthPrompt('Please sign in or create an account to start this workflow.');
      setAuthModalOpen(true);
      return;
    }

    startResearch(scenarioId, {}, scenarioId, currentUser.id);
  };

  // Handle switching to another saved process
  const handleSelectProcess = async (procId) => {
    try {
      const proc = await getProcess(procId);
      setActiveProcess(proc);
      setCurrentView('dashboard');
    } catch (err) {
      console.error("Failed to load process:", err);
    }
  };

  // Handle adaptive process update
  const handleAdaptiveUpdateSuccess = (updatedResult) => {
    if (activeProcess) {
      setActiveProcess(prev => ({
        ...prev,
        steps: updatedResult.steps,
        next_step: updatedResult.new_step,
        completion_percentage: updatedResult.completion_percentage,
        action_map: updatedResult.action_map
      }));
    }
  };

  // Handle process deletion from "My Processes"
  const handleProcessDeleted = (deletedId) => {
    setAllProcesses(prev => prev.filter(p => p.id !== deletedId));
    if (activeProcess?.id === deletedId) {
      setActiveProcess(null);
      setCurrentView('landing');
    }
  };

  const handleOpenProcessesClick = () => {
    if (!currentUser) {
      setAuthPrompt('Please sign in or create an account to view your tracked processes.');
      setAuthModalOpen(true);
      return;
    }
    setProcessesModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-blue-500/20 selection:text-blue-300">
      
      {/* Top Navbar */}
      <Navbar
        onOpenProcesses={handleOpenProcessesClick}
        onSelectScenario={handleSelectScenario}
        onReset={() => setCurrentView('landing')}
        activeProcessCount={allProcesses.length}
        currentView={currentView}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthPrompt(null);
          setAuthModalOpen(true);
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full flex flex-col">
        {currentView === 'landing' && (
          <LandingView
            onSubmitProblem={handleSubmitProblem}
            onSelectDemoScenario={handleSelectScenario}
          />
        )}

        {currentView === 'researching' && (
          <ResearchVisualizer
            problem={problemText || 'Processing request'}
            location={userLocation}
          />
        )}

        {currentView === 'dashboard' && activeProcess && (
          <ActionDashboard
            processData={activeProcess}
            onBack={() => setCurrentView('landing')}
            onOpenEmail={() => setEmailModalOpen(true)}
            onOpenDocument={() => setDocumentModalOpen(true)}
            onOpenAdaptive={() => setAdaptiveModalOpen(true)}
            onProcessUpdated={(updated) => setActiveProcess(updated)}
          />
        )}
      </main>

      {/* Dynamic Question Modal */}
      {questionModalOpen && (
        <QuestionModal
          questions={dynamicQuestions}
          remainingCount={remainingCount}
          onAnswerQuestion={handleAnswerQuestion}
          onSkipAll={handleSkipAllQuestions}
          problem={problemText}
        />
      )}

      {/* User Login & Registration Modal */}
      {authModalOpen && (
        <AuthModal
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onClose={() => {
            setAuthModalOpen(false);
            setAuthPrompt(null);
          }}
          promptMessage={authPrompt}
        />
      )}

      {/* Email Generator Modal */}
      {emailModalOpen && activeProcess && (
        <EmailModal
          processData={activeProcess}
          currentUser={currentUser}
          onClose={() => setEmailModalOpen(false)}
        />
      )}

      {/* Document Generator Modal */}
      {documentModalOpen && activeProcess && (
        <DocumentModal
          processData={activeProcess}
          currentUser={currentUser}
          onClose={() => setDocumentModalOpen(false)}
        />
      )}

      {/* Adaptive Process Updater Modal */}
      {adaptiveModalOpen && activeProcess && (
        <AdaptiveModal
          processData={activeProcess}
          onClose={() => setAdaptiveModalOpen(false)}
          onUpdateSuccess={handleAdaptiveUpdateSuccess}
        />
      )}

      {/* My Processes Tracker Modal */}
      {processesModalOpen && (
        <ProcessesModal
          processes={allProcesses}
          currentProcessId={activeProcess?.id}
          onSelectProcess={handleSelectProcess}
          onClose={() => setProcessesModalOpen(false)}
          onProcessDeleted={handleProcessDeleted}
          onNewTask={() => {
            setCurrentView('landing');
            setActiveProcess(null);
          }}
        />
      )}

      {/* Minimal Footer */}
      <footer className="w-full border-t border-neutral-900/80 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NEXTSTEP — Universal AI Action Agent · From problem to done.</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Powered by SerpApi Live Search Engine & Multi-Tier Jurisdiction Intelligence</span>
          </span>
        </div>
      </footer>

    </div>
  );
}
