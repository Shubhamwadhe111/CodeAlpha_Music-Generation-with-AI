import React, { useState } from 'react'
import { Cpu, Zap, Dna, Activity, SlidersHorizontal, Waves, Radio, User, LogOut, Settings, X, ShieldCheck } from 'lucide-react'
import { SpaceTimeGrid } from './components/SpaceTimeGrid'
import { TelemetryPanel } from './components/TelemetryPanel'
import { LibraryPanel } from './components/LibraryPanel'
import { GenerationPrompt } from './components/GenerationPrompt'
import { GenreCards } from './components/GenreCards'
import { AetherMidiPlayer } from './components/AetherMidiPlayer'
import { Sidebar } from './components/Sidebar'
import { HomePage } from './components/HomePage'
import { SignUpPage } from './components/SignUpPage'
import { LoginPage } from './components/LoginPage'
import { AIMusicGeneratorPage, PricingPage } from './components/PlaceholderPages'
import { StemSplitterPage } from './components/StemSplitterPage'
import { DiscoverPage } from './components/DiscoverPage'
import { TemplatesPage } from './components/TemplatesPage'
import { NeuralTelemetryOverlay } from './components/NeuralTelemetryOverlay'
import { NeuralMatrixStudio } from './components/NeuralMatrixStudio'


function App() {
  const [seqLength, setSeqLength] = useState(100)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMidi, setGeneratedMidi] = useState(null)
  const [history, setHistory] = useState([])
  const [instrument, setInstrument] = useState('acoustic_grand_piano')
  const [reverb, setReverb] = useState(0)
  const [delay, setDelay] = useState(0)
  const [filterCutoff, setFilterCutoff] = useState(20000)
  const [promptText, setPromptText] = useState('')
  const [view, setView] = useState('home') 
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Neural Explorer States
  const [isTurboMode, setIsTurboMode] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState(["[SYSTEM] Neural Command Console Initialized", "[AUTH] Pilot Authority Verified"])
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [devMode, setDevMode] = useState(false)
  
  // Mutation Chamber States
  const [showMutationChamber, setShowMutationChamber] = useState(false)
  const [leadTemp, setLeadTemp] = useState(1.1)
  const [bassTemp, setBassTemp] = useState(0.8)
  const [mutationIntensity, setMutationIntensity] = useState('Evolved')

  const [activeNotes, setActiveNotes] = useState([])
  const [audioData, setAudioData] = useState([])

  const handleAuthSuccess = (email = 'user@example.com') => {
    setIsLoggedIn(true)
    setUserEmail(email)
    setView('dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail(null)
    setView('home')
  }

  const handleNavigation = (newView) => {
    if (newView === 'home' && isLoggedIn) {
      setView('dashboard')
    } else {
      setView(newView)
    }
  }

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedMidi(null)
    setActiveNotes([])

    try {
      const res = await fetch('http://127.0.0.1:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notes: seqLength,
          lead_temp: leadTemp,
          bass_temp: bassTemp
        })
      })

      const data = await res.json()
      if (data.success) {
        setGeneratedMidi(data.midi_data)
        setHistory(prev => [{
          name: promptText.trim() || `Generated Sequence #${Math.floor(Math.random() * 9000) + 1000}`,
          notes: seqLength,
          duration: data.duration,
          data: data.midi_data
        }, ...prev])
      } else {
        alert("Singularity creation failed: " + data.error)
      }
    } catch (e) {
      alert("Core Engine Offline. Is Flask running on port 8000?")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNoteOn = (noteNum) => setActiveNotes(prev => [...prev, noteNum])
  const handleNoteOff = (noteNum) => setActiveNotes(prev => prev.filter(n => n !== noteNum))

  const handleLaunchTemplate = (tpl) => {
    // Inject template parameters into global state
    setSeqLength(tpl.params.seqLength)
    setInstrument(tpl.params.instrument)
    setReverb(tpl.params.reverb)
    setDelay(tpl.params.delay)
    setFilterCutoff(tpl.params.filterCutoff)
    setPromptText(`[${tpl.name}] Neural Constellation`)
    
    // Switch to studio view
    setView('dashboard')
  }

  const handleMutate = () => {
    setShowMutationChamber(true)
    setTerminalLogs(prev => [...prev, "[CHAMBER] Entering Neural Mutation Matrix..."])
  }

  const applyMutationChain = (intensity) => {
    setMutationIntensity(intensity)
    if (intensity === 'Subtle') {
      setLeadTemp(0.9); setBassTemp(0.7);
    } else if (intensity === 'Chaotic') {
      setLeadTemp(1.6); setBassTemp(1.2);
    } else {
      setLeadTemp(1.1); setBassTemp(0.8);
    }
    setTerminalLogs(prev => [...prev, `[MUTATE] Flux Chain: ${intensity} DNA initialized.`])
    
    // Quick random slider tweak as well for flavor
    setReverb(Math.random() * 0.8)
    setFilterCutoff(Math.floor(Math.random() * 15000) + 5000)
  }

  const handlePulseSync = () => {
    setIsSyncing(true)
    setTerminalLogs(prev => [...prev, "[SYNC] Synchronizing Neural Pathways..."])
    setTimeout(() => {
      setIsSyncing(false)
      setTerminalLogs(prev => [...prev, "[SYNC] Synchronization Complete. 98% Fidelity."])
    }, 2000)
  }

  const handleDiagnostics = async () => {
    setTerminalLogs(prev => [...prev, "[DIAG] Checking AI Core Health..."])
    try {
      const res = await fetch('http://127.0.0.1:8000/api/health')
      const data = await res.json()
      setShowDiagnostics(data)
      setTerminalLogs(prev => [...prev, `[DIAG] Core Status: ${data.status.toUpperCase()}`])
    } catch (e) {
      setTerminalLogs(prev => [...prev, "[DIAG] CORE OFFLINE: Connection Refused"])
      setShowDiagnostics({ status: 'offline', error: 'Connection Refused' })
    }
  }

  const handleToggleTurbo = () => {
    setIsTurboMode(!isTurboMode)
    setTerminalLogs(prev => [...prev, `[OPTIM] Turbo Mode: ${!isTurboMode ? 'ENGAGED' : 'DISENGAGED'}`])
  }

  const handleAddLog = (msg) => {
     setTerminalLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const bgStyle = {
    background: `
      radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
      linear-gradient(to bottom, #0a0a0f, #050508)
    `,
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    color: 'white',
    position: 'relative'
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <div className="aether-dashboard-view">
            <header className="view-header">
              <div className="header-text">
                <h1 className="header-title">Singularity Engine</h1>
                <p className="header-subtitle">Initialize neural matrix sequence and calculate audio vectors.</p>
              </div>
              
              <div className="header-actions">
                <button className="aether-btn aether-btn-light">
                  <span className="btn-icon">↑</span> Seed Data
                </button>

                {isLoggedIn && (
                  <div className="user-profile-header">
                    <div className="user-profile-summary">
                      <div className="user-avatar-small">
                        <User size={16} />
                      </div>
                      <div className="user-meta">
                        <span className="email-truncated">{userEmail || 'user@example.com'}</span>
                        <span className="badge-free">Free</span>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="aether-btn logout-circle-btn" title="Sign Out">
                      <LogOut size={16} />
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="workspace-grid">
              <div className="aether-panel workspace-controls">
                <GenerationPrompt
                  isGenerating={isGenerating}
                  handleGenerate={handleGenerate}
                  promptText={promptText} setPromptText={setPromptText}
                  seqLength={seqLength} setSeqLength={setSeqLength}
                  instrument={instrument} setInstrument={setInstrument}
                  reverb={reverb} setReverb={setReverb}
                  delay={delay} setDelay={setDelay}
                  filterCutoff={filterCutoff} setFilterCutoff={setFilterCutoff}
                />
              </div>

              <div className="aether-panel workspace-results">
                {!generatedMidi && history.length === 0 ? (
                  <div className="empty-state">
                    Your generated tracks will appear here
                  </div>
                ) : (
                  <div className="results-content">
                    <div className={`player-container ${generatedMidi ? 'visible' : ''}`}>
                      <AetherMidiPlayer
                        midiBase64={generatedMidi}
                        onNoteOn={handleNoteOn}
                        onNoteOff={handleNoteOff}
                        onAudioData={setAudioData}
                        instrumentName={instrument}
                        reverbLevel={reverb}
                        delayLevel={delay}
                        filterCutoff={filterCutoff}
                      />
                    </div>
                    {(isGenerating || activeNotes.length > 0) && (
                      <div className="telemetry-wrapper">
                        <TelemetryPanel activeNotesCount={activeNotes.length} isGenerating={isGenerating} audioData={audioData} />
                      </div>
                    )}
                    {history.length > 0 && (
                      <div className="library-wrapper">
                        <LibraryPanel history={history} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 'music-generator':
        return (
          <NeuralMatrixStudio 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            isTurboActive={isTurboMode}
            isDevActive={devMode}
            leadTemp={leadTemp} setLeadTemp={setLeadTemp}
            bassTemp={bassTemp} setBassTemp={setBassTemp}
            mutationIntensity={mutationIntensity}
            onApplyMutation={applyMutationChain}
            history={history}
            generatedMidi={generatedMidi}
            activeNotes={activeNotes}
            handleNoteOn={handleNoteOn}
            handleNoteOff={handleNoteOff}
          />
        )
      case 'stem-splitter': return <StemSplitterPage />
      case 'discover': return <DiscoverPage />
      case 'templates': return <TemplatesPage onLaunchTemplate={handleLaunchTemplate} />
      case 'pricing': return <PricingPage />
      case 'signup': return <SignUpPage onBack={() => setView('home')} onSwitchToLogin={() => setView('login')} onSuccess={handleAuthSuccess} />
      case 'login': return <LoginPage onBack={() => setView('home')} onSwitchToSignUp={() => setView('signup')} onSuccess={handleAuthSuccess} />
      default: return null
    }
  }

  return (
    <div className={`aether-app-container ${isTurboMode ? 'turbo-engaged' : ''}`}>
      <div className="aether-app-root" style={bgStyle}>
        <SpaceTimeGrid />
        
        {devMode && <NeuralTelemetryOverlay />}

      {view === 'home' ? (
        <HomePage 
          onLaunch={() => setView('dashboard')} 
          onSignUp={() => setView('signup')}
        />
      ) : view === 'signup' || view === 'login' ? (
        <main className="auth-view-container">
          {renderView()}
        </main>
      ) : (
        <>
          <Sidebar 
            currentView={view} 
            onNavigate={handleNavigation}
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            onToggleSidebar={handleToggleSidebar}
            isCollapsed={isSidebarCollapsed}
            
            // Neural Explorer Handlers
            onMutate={handleMutate}
            onSync={handlePulseSync}
            onDiagnostics={handleDiagnostics}
            onTerminal={() => setShowTerminal(!showTerminal)}
            onTurbo={handleToggleTurbo}
            onDevMode={() => setDevMode(!devMode)}
            isTurboActive={isTurboMode}
            isDevActive={devMode}
          />

          {/* Mutation Chamber Overlay */}
          {showMutationChamber && (
            <div className="mutation-chamber-overlay" onClick={() => setShowMutationChamber(false)}>
               <div className="mutation-panel aether-panel" onClick={e => e.stopPropagation()}>
                  <div className="chamber-header">
                     <div className="chamber-icon-box neural-pulse-active">
                        <Dna size={32} />
                     </div>
                     <div className="chamber-title-block">
                        <h2 className="chamber-title">Neural Mutation Chamber</h2>
                        <p className="chamber-subtitle">Manipulating Lead & Foundation Matrix DNA</p>
                     </div>
                  </div>

                  {/* Neural DNA Visualizer */}
                  <div className="dna-visualizer">
                     <svg viewBox="0 0 400 60" className="dna-svg">
                        <path d="M 0 30 Q 50 10 100 30 T 200 30 T 300 30 T 400 30" fill="none" stroke="var(--aether-cyan)" strokeWidth="2" opacity="0.5">
                           <animate attributeName="d" dur="3s" repeatCount="indefinite"
                              values="M 0 30 Q 50 10 100 30 T 200 30 T 300 30 T 400 30;
                                      M 0 30 Q 50 50 100 30 T 200 30 T 300 30 T 400 30;
                                      M 0 30 Q 50 10 100 30 T 200 30 T 300 30 T 400 30" />
                        </path>
                        <path d="M 0 30 Q 50 50 100 30 T 200 30 T 300 30 T 400 30" fill="none" stroke="var(--aether-pink)" strokeWidth="2" opacity="0.5">
                           <animate attributeName="d" dur="3s" repeatCount="indefinite"
                              values="M 0 30 Q 50 50 100 30 T 200 30 T 300 30 T 400 30;
                                      M 0 30 Q 50 10 100 30 T 200 30 T 300 30 T 400 30;
                                      M 0 30 Q 50 50 100 30 T 200 30 T 300 30 T 400 30" />
                        </path>
                     </svg>
                  </div>

                  <div className="mutation-controls">
                     <div className="intensity-selector">
                        <label>MUTATION_INTENSITY</label>
                        <div className="intensity-grid">
                           {['Subtle', 'Evolved', 'Chaotic'].map(level => (
                             <button 
                                key={level} 
                                className={`int-btn ${mutationIntensity === level ? 'active' : ''}`}
                                onClick={() => applyMutationChain(level)}
                             >
                                {level}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="temp-sliders">
                        <div className="temp-row">
                           <div className="temp-info">
                              <span>MELODIC_FLUX (Lead)</span>
                              <b>{leadTemp.toFixed(2)}</b>
                           </div>
                           <input type="range" min="0.5" max="2.0" step="0.1" value={leadTemp} onChange={e => setLeadTemp(parseFloat(e.target.value))} />
                        </div>
                        <div className="temp-row">
                           <div className="temp-info">
                              <span>FOUNDATION_SYNC (Bass)</span>
                              <b>{bassTemp.toFixed(2)}</b>
                           </div>
                           <input type="range" min="0.5" max="2.0" step="0.1" value={bassTemp} onChange={e => setBassTemp(parseFloat(e.target.value))} />
                        </div>
                     </div>
                  </div>

                  <div className="chamber-footer">
                     <button className="aether-btn aether-btn-primary full-width" onClick={() => { setShowMutationChamber(false); handleGenerate(); }}>
                        Initialize Mutated Sequence
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* Neural Terminal Overlay */}
          {showTerminal && (
            <div className="neural-terminal-overlay aether-panel">
               <div className="terminal-header">
                  <span className="terminal-title">AETHER_CMD_V3.2</span>
                  <button onClick={() => setShowTerminal(false)}><X size={14} /></button>
               </div>
               <div className="terminal-body">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="terminal-line">{log}</div>
                  ))}
                  <div className="terminal-cursor">_</div>
               </div>
            </div>
          )}

          {/* Syncing Overlay */}
          {isSyncing && (
            <div className="sync-fullscreen-overlay">
               <div className="sync-content">
                  <div className="sync-spinner neural-pulse-active">
                     <Activity size={48} />
                  </div>
                  <h2 className="sync-text">SYNCHRONIZING_NEURAL_CORE...</h2>
               </div>
            </div>
          )}

          {/* Diagnostics Modal */}
          {showDiagnostics && (
            <div className="diag-modal-overlay" onClick={() => setShowDiagnostics(false)}>
               <div className="diag-modal aether-panel" onClick={e => e.stopPropagation()}>
                  <div className="diag-header">
                     <ShieldCheck size={24} className={showDiagnostics.status === 'online' ? 'text-green' : 'text-red'} />
                     <h2>Diagnostic Report</h2>
                  </div>
                  <div className="diag-grid">
                     <div className="diag-item"><span>STATUS:</span> <b className={showDiagnostics.status === 'online' ? 'text-green' : 'text-red'}>{showDiagnostics.status?.toUpperCase() || 'OFFLINE'}</b></div>
                     <div className="diag-item"><span>ENGINE:</span> <b>{showDiagnostics.engine || 'Unknown'}</b></div>
                     <div className="diag-item"><span>MODEL:</span> <b>{showDiagnostics.model_loaded ? 'ACTIVE' : 'NOT_LOADED'}</b></div>
                     <div className="diag-item"><span>LATENCY:</span> <b>12ms</b></div>
                  </div>
                  <button className="aether-btn aether-btn-primary" onClick={() => setShowDiagnostics(false)}>Close Diagnostic</button>
               </div>
            </div>
          )}

          <main className={`main-content-area ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
            {renderView()}
          </main>
        </>
      )}

      <style>{`
        .aether-dashboard-view {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 1rem 1.5rem;
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
        }

        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .header-title {
          font-size: 2rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.05em;
          background: linear-gradient(to right, var(--aether-violet), var(--aether-cyan));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .header-subtitle {
          color: var(--aether-text-muted);
          font-family: monospace;
          font-size: 0.875rem;
        }

        .workspace-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 1.5rem;
          min-height: 0;
          padding-bottom: 1.5rem;
        }

        @media (max-width: 1024px) {
          .workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        .workspace-controls {
          height: 100%;
          overflow-y: auto;
        }

        .workspace-results {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: relative;
        }

        .empty-state {
          margin: auto;
          color: var(--aether-text-muted);
          font-size: 1.125rem;
          font-weight: 500;
        }

        .results-content {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .player-container {
          transition: all 0.7s var(--ease-aether);
          overflow: hidden;
          max-height: 0;
          opacity: 0;
        }

        .player-container.visible {
          max-height: 500px;
          opacity: 1;
          margin-top: 0.5rem;
        }

        .auth-view-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
          position: relative;
          z-index: 10;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .main-content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: relative;
          z-index: 10;
          width: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          background: rgba(10, 10, 15, 0.4);
          transition: margin-left var(--duration-slow) var(--ease-aether);
        }

        .sidebar-expanded {
          margin-left: 260px;
        }

        .sidebar-collapsed {
          margin-left: 80px;
        }

        .aether-btn-light {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-icon {
          color: var(--aether-cyan);
          font-weight: bold;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-profile-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--aether-glass);
          padding: 0.35rem 0.35rem 0.35rem 0.75rem;
          border-radius: var(--rounded-full);
          border: 1px solid var(--aether-border);
          backdrop-filter: blur(12px);
        }

        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .user-avatar-small {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--aether-violet), var(--aether-pink));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .user-meta {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .email-truncated {
          font-size: 0.75rem;
          font-weight: 700;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .badge-free {
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--aether-cyan);
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .logout-circle-btn {
          width: 32px;
          height: 32px;
          padding: 0;
          border-radius: 50%;
          border: 1px solid var(--aether-border);
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .logout-circle-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          transform: rotate(90deg);
        }
        .mutation-chamber-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(15px);
          z-index: 6000;
          display: flex; align-items: center; justify-content: center;
        }

        .mutation-panel {
          width: 440px;
          padding: 2rem;
          background: var(--aether-glass) !important;
          border-color: var(--aether-cyan-glow) !important;
          box-shadow: 0 0 50px rgba(6, 182, 212, 0.15);
        }

        .chamber-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
        .chamber-icon-box {
          width: 64px; height: 64px;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid var(--aether-cyan);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: var(--aether-cyan);
        }

        .chamber-title { font-size: 1.25rem; font-weight: 900; color: white; margin-bottom: 0.25rem; }
        .chamber-subtitle { font-size: 0.75rem; color: var(--aether-text-muted); text-transform: uppercase; letter-spacing: 0.1em; }

        .dna-visualizer {
          height: 60px; margin-bottom: 2rem;
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          overflow: hidden;
        }

        .intensity-selector { margin-bottom: 2rem; }
        .intensity-selector label { font-size: 0.65rem; font-weight: 900; color: var(--aether-text-muted); display: block; margin-bottom: 0.75rem; }
        .intensity-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        
        .int-btn {
          padding: 0.75rem; background: rgba(255,255,255,0.03);
          border: 1px solid var(--aether-border); border-radius: 8px;
          color: var(--aether-text-muted); font-size: 0.8rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
        }
        .int-btn:hover { background: rgba(255,255,255,0.05); color: white; }
        .int-btn.active {
          background: var(--aether-cyan-glow);
          border-color: var(--aether-cyan);
          color: white;
          box-shadow: 0 0 15px var(--aether-cyan-glow);
        }

        .temp-sliders { display: grid; gap: 1.5rem; margin-bottom: 2.5rem; }
        .temp-row { display: flex; flex-direction: column; gap: 0.75rem; }
        .temp-info { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--aether-text-muted); }
        .temp-info b { color: var(--aether-cyan); font-family: monospace; }

        .full-width { width: 100%; justify-content: center; padding: 1rem; font-weight: 900; font-size: 0.9rem; }

        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
      </div>
    </div>
  )
}

export default App
