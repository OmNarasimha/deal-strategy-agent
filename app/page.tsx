"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, PlusCircle, BrainCircuit, 
  MessageSquare, X, Send, Loader2, History, ShieldCheck, 
  TrendingUp, AlertTriangle, Target, CheckCircle2, Info, FileText, 
  Building2, Lightbulb, Play, Sparkles, Fingerprint, RefreshCcw, Trash2, Edit3, Wand2, Globe, Menu
} from 'lucide-react';
import { memoryLayer } from './lib/memory_layer';
import { extractInsights, generateAdvancedStrategy, generateSyntheticTranscript, generateFullSampleDeal } from './groq';
import { Interaction, AIStrategy } from './lib/types';

export default function Dashboard() {
  // 1. STATE MANAGEMENT
  const [deals, setDeals] = useState([
    { id: 1, name: "Acme Corp Expansion", stage: "Discovery", status: "Warm", summary: "Server fleet scaling.", win_rate: 72 },
    { id: 2, name: "Global Tech Solutions", stage: "Demo Done", status: "Hot", summary: "UI/UX revamp.", win_rate: 85 },
    { id: 3, name: "Dorasani Saree Store", stage: "Negotiation", status: "Hot", summary: "E-commerce automation.", win_rate: 90 },
    { id: 4, name: "Nexus Systems", stage: "Discovery", status: "Cold", summary: "Cloud migration.", win_rate: 30 },
  ]);

  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [aiStrategy, setAiStrategy] = useState<AIStrategy | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [newDealName, setNewDealName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [source, setSource] = useState<'Call' | 'Email' | 'LinkedIn' | 'PDF'>('Call');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [meetingPrep, setMeetingPrep] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // NEW: Sidebar state for Mobile Responsiveness
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 2. CORE INTELLIGENCE LOADER
  useEffect(() => { if (selectedDeal) loadDealData(selectedDeal); }, [selectedDeal]);

  const loadDealData = async (deal: any) => {
    setIsAnalyzing(true);
    setError(null);
    setMeetingPrep(null);
    setShowExplanation(false);
    
    try {
      const history = await memoryLayer.getMemoriesByDeal(deal.id);
      const patterns = await memoryLayer.getWinningPatterns();
      const realWinProb = await memoryLayer.calculateWinProbability(history);
      const strategy = await generateAdvancedStrategy(deal, history, patterns);

      setInteractions(history);
      setAiStrategy({ ...strategy, success_probability: realWinProb });
    } catch (err) {
      console.error(err);
      setError("Intelligence Layer connection interrupted.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. ACTION HANDLERS
  const handleMarkOutcome = async (outcome: 'won' | 'lost') => {
    if (!selectedDeal) return;
    try {
      await memoryLayer.updateDealOutcome(selectedDeal.id, outcome);
      alert(`Institutional Knowledge Updated: Deal marked as ${outcome.toUpperCase()}.`);
      await loadDealData(selectedDeal); 
    } catch (e) {
      setError("Failed to update deal outcome.");
    }
  };

  const handleManagementAction = async (action: 'delete' | 'edit', id: string, currentVal?: string) => {
    if (action === 'delete') {
      if (confirm("Permanently remove this interaction?")) {
        await memoryLayer.deleteMemory(id);
        await loadDealData(selectedDeal);
      }
    } else {
      const newVal = prompt("Update Interaction Summary:", currentVal);
      if (newVal) {
        await memoryLayer.updateMemory(id, { summary: newVal });
        await loadDealData(selectedDeal);
      }
    }
  };

  // FIX: Ensures unique stories for every deal ID
  const handleGenerateFullDemo = async () => {
    if (!selectedDeal) return alert("Select a deal name first!");
    setIsLoading(true);
    try {
      const sampleHistory = await generateFullSampleDeal(selectedDeal.name);
      for (const entry of sampleHistory) {
        const newInt: Interaction = {
          ...entry,
          id: `ai-story-${selectedDeal.id}-${Math.random().toString(36).substr(2, 5)}`,
          deal_id: selectedDeal.id,
          outcome: 'pending',
          timestamp: entry.timestamp || new Date().toLocaleString()
        };
        await memoryLayer.addMemory(newInt);
      }
      await loadDealData(selectedDeal);
    } catch (e) {
      setError("Failed to generate AI narrative.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDeal = () => {
    if (!newDealName) return;
    const newDeal = { id: Date.now(), name: newDealName, stage: "Discovery", status: "Warm", summary: "New project.", win_rate: 50 };
    setDeals([newDeal, ...deals]);
    setNewDealName("");
    setIsDealModalOpen(false);
    setSelectedDeal(newDeal);
  };

  const handleSaveInteraction = async () => {
    if (!transcript || !selectedDeal) return;
    setIsLoading(true);
    try {
      const insights = await extractInsights(transcript, source);
      const newInt: Interaction = {
        id: Date.now().toString(), deal_id: selectedDeal.id, transcript,
        timestamp: new Date().toLocaleString(), stage: selectedDeal.stage as any, ...insights, 
        outcome: 'pending', source: source
      };
      await memoryLayer.addMemory(newInt);
      await loadDealData(selectedDeal);
      setTranscript("");
      setIsModalOpen(false);
    } catch (e) {
      setError("Failed to commit interaction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans relative">
      
      {/* MOBILE HAMBURGER BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-slate-900 text-white rounded-2xl shadow-xl"
      >
        <Menu size={20} />
      </button>

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[60] 
        w-72 bg-slate-900 text-white p-8 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* CLOSE BUTTON (Mobile Only) */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg"><BrainCircuit size={28} /></div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">DEALINTEL</h1>
        </div>

        {/* INSTITUTIONAL SYNC TICKER */}
        <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl mb-4 border border-slate-700">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 text-blue-400">
               <RefreshCcw size={10} className="animate-spin" />
               <p className="text-[10px] font-black uppercase">Network Sync</p>
            </div>
            <p className="text-[9px] text-slate-500 font-bold leading-tight italic">Pattern Detected: "ROI-First" (validated by NYC Rep)</p>
          </div>
        </div>

        {/* DEMO MODE TOGGLE */}
        <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl mb-6 border border-slate-700">
          <div className="flex-1">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Demo Mode</p>
          </div>
          <button 
            onClick={() => {
              setIsDemoMode(!isDemoMode);
              if(!isDemoMode) {
                setDeals([
                  { id: 101, name: "Tesla Energy Hub", stage: "Discovery", status: "Warm", summary: "Grid storage scaling.", win_rate: 50 },
                  { id: 102, name: "SpaceX Starlink", stage: "Negotiation", status: "Hot", summary: "Global mesh network.", win_rate: 85 },
                  ...deals
                ]);
              }
            }}
            className={`w-10 h-5 rounded-full transition-all relative ${isDemoMode ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDemoMode ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>

        <button onClick={() => { setIsDealModalOpen(true); setIsSidebarOpen(false); }} className="w-full mb-6 flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 p-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition">
          <PlusCircle size={16} /> New Deal
        </button>
        
        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-3">Active Pipeline</p>
          {deals.map(d => (
            <button key={d.id} onClick={() => { setSelectedDeal(d); setIsSidebarOpen(false); }} className={`w-full text-left p-4 rounded-2xl transition text-sm mb-1 ${selectedDeal?.id === d.id ? 'bg-blue-600 text-white font-bold shadow-xl' : 'text-slate-400 hover:bg-slate-800'}`}>{d.name}</button>
          ))}
        </nav>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[55] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
        
        <section className="flex-1 p-6 lg:p-10 overflow-y-auto bg-white/50 border-r border-slate-200 w-full">
          {!selectedDeal ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Target size={80} className="mb-4 animate-bounce" />
              <p className="font-black uppercase tracking-widest text-[10px]">Select deal to initialize</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 mt-12 lg:mt-0">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tighter">{selectedDeal.name}</h2>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 px-3 py-1 bg-slate-100 rounded-lg inline-block">Stage: {selectedDeal.stage}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={handleGenerateFullDemo} disabled={isLoading} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black uppercase text-[10px] border border-indigo-100 shadow-sm transition disabled:opacity-50">
                      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} AI Story
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] shadow-2xl hover:scale-105 transition-all">
                      <PlusCircle size={18} /> Add Note
                    </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Chronological Hindsight</h4>
                {interactions.length > 0 ? (
                  interactions.map((item, i) => (
                    <div key={item.id || i} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex gap-5 animate-in slide-in-from-top-2 relative transition-all hover:shadow-md">
                       <div className={`mt-2 w-2.5 h-2.5 rounded-full shrink-0 ${item.sentiment === 'positive' ? 'bg-green-500' : item.sentiment === 'negative' ? 'bg-red-500' : 'bg-slate-300'}`} />
                       <div className="flex-1">
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.timestamp}</p>
                                {item.source && <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase border border-slate-200">{item.source}</span>}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleManagementAction('edit', item.id, item.summary)} className="text-slate-400 hover:text-blue-600"><Edit3 size={12}/></button>
                                <button onClick={() => handleManagementAction('delete', item.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={12}/></button>
                            </div>
                         </div>
                         <p className="text-[15px] font-bold text-slate-700 leading-snug">{item.summary}</p>
                         <div className="flex flex-wrap gap-2 mt-4">
                            {item.objections.map((obj, j) => (<span key={j} className="text-[9px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase border border-orange-100">⚠️ {obj}</span>))}
                            {item.competitors?.map((comp, l) => (<span key={l} className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase border border-blue-100">🔥 {comp}</span>))}
                         </div>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[40px] opacity-40">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Vault Empty. Click AI Story or Add a Note.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* AI PANEL */}
        <aside className="w-full lg:w-[480px] bg-white p-6 lg:p-10 overflow-y-auto shadow-2xl border-t lg:border-t-0 lg:border-l border-slate-200">
          {selectedDeal && (
            isAnalyzing ? (
              <div className="space-y-8 animate-pulse">
                <div className="h-6 w-32 bg-slate-100 rounded-full"></div>
                <div className="h-64 bg-slate-900 rounded-[48px]"></div>
                <div className="h-40 bg-slate-50 rounded-3xl"></div>
              </div>
            ) : aiStrategy ? (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-2"><ShieldCheck className="text-blue-600" size={20} /> AI Command Center</h3>
                  <button 
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${showExplanation ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                  >
                    <Fingerprint size={14} /> {showExplanation ? "Hide Logic" : "Explain AI"}
                  </button>
                </div>

                <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Win Probability</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl lg:text-7xl font-black tracking-tighter">{aiStrategy.success_probability}%</span>
                    <TrendingUp className={aiStrategy.success_probability > 60 ? "text-green-400" : "text-orange-400"} size={28} />
                  </div>
                  <div className="mt-6 flex gap-4 border-t border-slate-800 pt-4 opacity-70 text-[9px] font-black uppercase">
                      <div><span className="text-blue-400">{aiStrategy.memory_count}</span> Insights</div>
                      <div><span className="text-blue-400">{aiStrategy.similar_deal_count}</span> Semantic Matches</div>
                  </div>
                </div>

                {showExplanation && (
                  <div className="bg-slate-900 border border-blue-500/30 rounded-[32px] p-6 shadow-2xl space-y-4">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Globe className="text-blue-400" size={14}/> Semantic Audit Trail</h4>
                    <p className="text-[11px] text-slate-300 italic mb-6 leading-relaxed">"{aiStrategy.reasoning || aiStrategy.key_influence}"</p>
                    <div className="space-y-3">
                      {aiStrategy.used_memories?.map((evidence: any, idx: number) => (
                        <div key={idx} className="bg-slate-800/50 border border-slate-700 p-3 rounded-2xl flex gap-3 items-start">
                          <div className="bg-blue-500/20 p-1.5 rounded-lg"><History size={12} className="text-blue-400" /></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <div className="text-[10px] font-bold text-white leading-none">{evidence.source_call}</div>
                                <div className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">94% Match</div>
                            </div>
                            <div className="text-[9px] text-slate-400 mt-1 leading-tight">{evidence.detected_signal}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {aiStrategy.learned_insight && (
                      <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                          <Lightbulb size={18} className="text-green-600" />
                          <p className="text-[10px] font-black text-green-700 uppercase italic tracking-tighter">{aiStrategy.learned_insight}</p>
                      </div>
                  )}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Closing Strategy</h4>
                    <div className="p-6 bg-blue-50 border border-blue-100 text-slate-700 rounded-3xl text-sm font-medium italic shadow-sm leading-relaxed">"{aiStrategy.strategy}"</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleMarkOutcome('won')} className="py-4 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-[10px] font-black uppercase hover:bg-green-100 transition shadow-sm">Mark Won</button>
                    <button onClick={() => handleMarkOutcome('lost')} className="py-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-[10px] font-black uppercase hover:bg-red-100 transition shadow-sm">Mark Lost</button>
                  </div>
                  <button onClick={() => setMeetingPrep(aiStrategy.script)} className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-blue-700 transition-all active:scale-95 shadow-blue-100">Prepare Battle Script</button>
                  {meetingPrep && (
                    <div className="p-6 bg-slate-900 rounded-3xl text-white text-[12px] font-medium animate-in slide-in-from-bottom-2 whitespace-pre-line border-l-4 border-blue-500 shadow-2xl">
                      <FileText size={20} className="mb-3 text-blue-400" /> {meetingPrep}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 opacity-30">
                <BrainCircuit size={48} className="mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Select Deal to Analyze</p>
              </div>
            )
          )}
        </aside>
      </main>

      {/* MODALS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 z-[100] text-slate-900">
          <div className="bg-white rounded-[48px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 lg:p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tighter">Commit Interaction</h3>
              <X className="cursor-pointer text-slate-300 hover:text-slate-900 transition" onClick={() => setIsModalOpen(false)} size={32} />
            </div>
            <div className="p-8 lg:p-12 space-y-6">
              <div className="flex gap-2 lg:gap-3 flex-wrap">
                {['Call', 'Email', 'LinkedIn', 'PDF'].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setSource(s as any)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${source === s ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <textarea className="w-full h-64 lg:h-80 p-8 bg-slate-50 border-2 border-slate-100 rounded-[40px] outline-none focus:border-blue-600 text-lg font-medium resize-none transition-all shadow-inner" placeholder={`Paste ${source} content here...`} value={transcript} onChange={(e) => setTranscript(e.target.value)} />
              <button onClick={handleSaveInteraction} disabled={isLoading || !transcript} className="w-full py-6 lg:py-8 bg-blue-600 text-white rounded-[40px] font-black uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-4">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <BrainCircuit size={24} />}
                {isLoading ? "Synthesizing Hindsight..." : "Commit Interaction"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDealModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 z-[100] text-slate-900">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95">
            <h3 className="text-3xl font-black mb-6 uppercase italic tracking-tighter">Initialize Deal</h3>
            <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-600 mb-8 text-slate-900 font-bold" placeholder="Company Name" value={newDealName} onChange={(e) => setNewDealName(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setIsDealModalOpen(false)} className="flex-1 py-5 text-slate-400 font-black uppercase text-[10px]">Cancel</button>
              <button onClick={handleCreateDeal} className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-[10px] shadow-lg">Start Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}