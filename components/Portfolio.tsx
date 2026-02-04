
import React, { useState, useRef, useMemo } from 'react';
import { 
  User, Code2, Rocket, ExternalLink, Github, Linkedin, Mail, Cpu, Globe, 
  MessageSquare, Mic, FileText, Award, Layers, Target, Briefcase, Camera, 
  Upload, Check, Edit3, Save, Phone, MapPin, Eye, EyeOff, ShieldCheck, Users,
  Plus, Trash2, X, Star, Zap, Folder, FolderPlus, ChevronRight, ChevronDown,
  FilePlus, Link as LinkIcon, MoreVertical, Archive, LayoutGrid, List
} from 'lucide-react';
import { getProfile, saveProfile } from '../services/storageService';
import { ProfileData, Project, ProjectFolder, FolderItem } from '../types';

const Portfolio: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = getProfile();
    const defaultProjects: Project[] = [
      {
        id: '1',
        title: 'SmartGadgets',
        desc: 'AI-powered smart gadget assistant built with Google AI Studio to analyze, recommend, and manage intelligent devices.',
        tech: ['Gemini 3 Pro', 'Google Search', 'Live API', 'React'],
        status: 'Capstone Final',
        color: 'indigo',
        link: 'https://smart-gadget-chi.vercel.app/',
        folderId: 'f2'
      },
      {
        id: '2',
        title: 'BrainyGen',
        desc: 'BrainyGen is an AI-powered smart gadget assistant built with Google AI Studio that helps users explore, understand, and choose intelligent devices.',
        tech: ['Google AI Studio', 'Gemini 3 Pro', 'React', 'Tailwind'],
        status: 'Live Demo',
        color: 'emerald',
        link: 'https://brainy-gen-eight.vercel.app',
        folderId: 'f2'
      },
      {
        id: '3',
        title: 'EquiAudit',
        desc: 'AI-driven auditing platform ensuring algorithmic fairness and organizational equity through automated compliance checks.',
        tech: ['Python', 'Gemini', 'Scikit-learn', 'React'],
        status: 'Research Lead',
        color: 'purple',
        github: 'https://github.com/nxelesthokozile-bit/EquiAudit'
      },
      {
        id: '4',
        title: 'Sentix',
        desc: 'High-velocity sentiment intelligence engine analyzing emotional trajectories in social datasets for brand management.',
        tech: ['NLP', 'Gemini 3 Flash', 'Node.js', 'WebSocket'],
        status: 'Beta Release',
        color: 'rose',
        github: 'https://github.com/nxelesthokozile-bit/Sentix'
      },
      {
        id: '5',
        title: 'AgriGuard-AI',
        desc: 'Precision agriculture system utilizing computer vision and predictive AI to monitor crop health and environmental variables.',
        tech: ['Computer Vision', 'Gemini 3 Pro', 'IoT', 'Python'],
        status: 'MVP Build',
        color: 'amber',
        github: 'https://github.com/nxelesthokozile-bit/AgriGuard-AI'
      },
      {
        id: '6',
        title: 'Londi-AI',
        desc: 'A sophisticated personal intelligence agent focused on automating complex digital workflows and providing context-aware decision support.',
        tech: ['Gemini 3 Pro', 'TypeScript', 'LLMOps'],
        status: 'Development',
        color: 'cyan',
        github: 'https://github.com/nxelesthokozile-bit/Londi-AI'
      },
      {
        id: '7',
        title: 'SentiPulse-Pro',
        desc: 'Advanced sentiment analysis platform that utilizes the Gemini Live API for real-time emotional pulse tracking across multi-channel customer interactions.',
        tech: ['Gemini Live', 'NLP', 'Real-time Analytics', 'Tailwind'],
        status: 'V1.0 Release',
        color: 'violet',
        github: 'https://github.com/nxelesthokozile-bit/SentiPulse-Pro'
      }
    ];

    return {
      biography: "I thrive in multitasking environments and excel at building strong relationships with customers and colleagues. Committed to representing my team with professionalism and integrity.",
      brandStatement: "I’m Londiwe Nxele, a highly organized professional passionate about providing exceptional service and operational support. I thrive in multitasking environments, excel at building strong relationships customers and colleagues, If am given an opportunity by a company I am committed to representing myself with professionalism and integrity.",
      email: "londiwe.nxele@capaciti.org.za",
      phone: "0734354683",
      location: "120 Main street, Johannesburg",
      linkedinUrl: "https://www.linkedin.com/in/londiwe-sthokozile-precious-nxele-a43125317",
      githubUrl: "https://github.com/nxelesthokozile-bit",
      projects: defaultProjects,
      folders: [
        { id: 'f1', name: 'Certifications', icon: 'Award', items: [] },
        { id: 'f2', name: 'Project Case Studies', icon: 'Archive', items: [] }
      ],
      ...saved
    };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['f1', 'f2']));
  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const skills = [
    { name: 'Communication', level: 100, label: 'Expert', icon: MessageSquare, tags: ['Interpersonal', 'Engagement', 'Clarity'], color: 'indigo' },
    { name: 'Adaptability', level: 95, label: 'Advanced', icon: Layers, tags: ['Change Resilience', 'Problem Solving', 'Flexibility'], color: 'purple' },
    { name: 'Work Ethic', level: 100, label: 'Expert', icon: ShieldCheck, tags: ['Integrity', 'Consistency', 'Reliability'], color: 'emerald' },
    { name: 'Reliability', level: 100, label: 'Expert', icon: Briefcase, tags: ['Dependability', 'Accountability', 'Consistency'], color: 'amber' },
    { name: 'AI Orchestration', level: 85, label: 'Advanced', icon: Cpu, tags: ['Gemini 3', 'Veo 3.1', 'LLMOps'], color: 'rose' },
    { name: 'Solutions Strategy', level: 90, label: 'Advanced', icon: Rocket, tags: ['Prompting', 'Strategic AI', 'Implementation'], color: 'blue' },
  ];

  // Logic to group projects by folder
  const groupedProjects = useMemo(() => {
    const uncategorized: Project[] = [];
    const categorized: Record<string, Project[]> = {};

    (profile.projects || []).forEach(p => {
      if (p.folderId) {
        if (!categorized[p.folderId]) categorized[p.folderId] = [];
        categorized[p.folderId].push(p);
      } else {
        uncategorized.push(p);
      }
    });

    return { uncategorized, categorized };
  }, [profile.projects]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'resume') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File too large. Please select a file smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updatedProfile = { ...profile };
      
      if (type === 'avatar') {
        updatedProfile.avatar = base64String;
      } else {
        updatedProfile.resumeData = base64String;
        updatedProfile.resumeName = file.name;
      }

      setProfile(updatedProfile);
      saveProfile(updatedProfile);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveText = () => {
    saveProfile(profile);
    setIsEditing(false);
  };

  const downloadResume = () => {
    if (!profile.resumeData) {
      alert("Please upload a resume first.");
      return;
    }
    const link = document.createElement('a');
    link.href = profile.resumeData;
    link.download = profile.resumeName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addFolder = () => {
    const newFolder: ProjectFolder = {
      id: Date.now().toString(),
      name: 'New Folder',
      icon: 'Folder',
      items: []
    };
    setProfile(prev => ({
      ...prev,
      folders: [...(prev.folders || []), newFolder]
    }));
    setExpandedFolders(prev => new Set(prev).add(newFolder.id));
  };

  const removeFolder = (id: string) => {
    setProfile(prev => ({
      ...prev,
      folders: (prev.folders || []).filter(f => f.id !== id),
      // Reset projects that were in this folder
      projects: (prev.projects || []).map(p => p.folderId === id ? { ...p, folderId: undefined } : p)
    }));
  };

  const addItemToFolder = (folderId: string) => {
    const newItem: FolderItem = {
      id: Date.now().toString(),
      title: 'New Resource',
      link: '#',
      type: 'link'
    };
    setProfile(prev => ({
      ...prev,
      folders: (prev.folders || []).map(f => 
        f.id === folderId ? { ...f, items: [...f.items, newItem] } : f
      )
    }));
  };

  const updateFolderItem = (folderId: string, itemId: string, updates: Partial<FolderItem>) => {
    setProfile(prev => ({
      ...prev,
      folders: (prev.folders || []).map(f => 
        f.id === folderId 
          ? { ...f, items: f.items.map(i => i.id === itemId ? { ...i, ...updates } : i) } 
          : f
      )
    }));
  };

  const removeFolderItem = (folderId: string, itemId: string) => {
    setProfile(prev => ({
      ...prev,
      folders: (prev.folders || []).map(f => 
        f.id === folderId ? { ...f, items: f.items.filter(i => i.id !== itemId) } : f
      )
    }));
  };

  const toggleFolder = (id: string) => {
    const next = new Set(expandedFolders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedFolders(next);
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      desc: 'Short description of your project and its impact.',
      tech: ['React', 'AI'],
      status: 'In Progress',
      color: 'indigo'
    };
    setProfile(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProject]
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProfile(prev => ({
      ...prev,
      projects: (prev.projects || []).map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const removeProject = (id: string) => {
    setProfile(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(p => p.id !== id)
    }));
  };

  // Helper to render a project card
  const ProjectCard = ({ proj, compact = false }: { proj: Project, compact?: boolean, key?: React.Key }) => (
    <div className={`glass-morphism rounded-[2.5rem] border border-white/5 flex flex-col hover:border-indigo-500/20 transition-all group shadow-xl relative ${compact ? 'p-6' : 'p-8'}`}>
      {isEditing && (
        <button 
          onClick={() => removeProject(proj.id)}
          className="absolute top-4 right-4 p-2 text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors z-20"
        >
          <Trash2 size={16} />
        </button>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Assignment</label>
            <select 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-indigo-400 font-black uppercase"
              value={proj.folderId || ''}
              onChange={e => updateProject(proj.id, { folderId: e.target.value || undefined })}
            >
              <option value="">Main Showcase</option>
              {(profile.folders || []).map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status Badge</label>
            <input 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-indigo-400 font-black uppercase"
              value={proj.status}
              onChange={e => updateProject(proj.id, { status: e.target.value })}
              placeholder="Status"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Project Title</label>
            <input 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-lg font-bold text-slate-100"
              value={proj.title}
              onChange={e => updateProject(proj.id, { title: e.target.value })}
              placeholder="Project Title"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Description</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400 min-h-[80px]"
              value={proj.desc}
              onChange={e => updateProject(proj.id, { desc: e.target.value })}
              placeholder="Project Description"
            />
          </div>
        </div>
      ) : (
        <>
          <div className={`self-start px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${proj.color}-500/10 text-${proj.color}-400 border border-${proj.color}-500/20 mb-6`}>
            {proj.status}
          </div>
          <h4 className={`${compact ? 'text-xl' : 'text-2xl'} font-black text-slate-100 mb-4`}>{proj.title}</h4>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-slate-400 leading-relaxed mb-8 flex-1`}>
            {proj.desc}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {proj.tech.map(t => (
              <span key={t} className="text-[10px] px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 font-bold uppercase tracking-tight">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <a 
              href={proj.link || '#'} 
              target="_blank" 
              rel="noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black transition-all border ${
                proj.link 
                ? 'bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border-indigo-500/20' 
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
              }`}
              onClick={e => !proj.link && e.preventDefault()}
            >
              {compact ? <ExternalLink size={14} /> : 'Live Demo'}
            </a>
            <a 
              href={proj.github || '#'}
              target="_blank"
              rel="noreferrer"
              className={`p-4 rounded-2xl border transition-all ${
                proj.github 
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800' 
                : 'bg-slate-950 text-slate-700 border-slate-900 cursor-not-allowed opacity-50'
              }`}
              onClick={e => !proj.github && e.preventDefault()}
            >
              <Github size={20} />
            </a>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hidden Inputs */}
      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={resumeInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resume')} />

      {/* Portfolio Controls */}
      <div className="flex justify-end gap-4">
        <button 
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all"
        >
          {isPreviewMode ? <><EyeOff size={14} /> Exit Preview</> : <><Eye size={14} /> Public Preview</>}
        </button>
        {!isPreviewMode && (
          <button 
            onClick={() => isEditing ? handleSaveText() : setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              isEditing ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-indigo-600 border-indigo-500 text-white'
            }`}
          >
            {isEditing ? <><Save size={14} /> Save Profile</> : <><Edit3 size={14} /> Edit Profile</>}
          </button>
        )}
      </div>

      {/* Hero Section */}
      <div className="glass-morphism p-10 rounded-[3rem] border border-white/10 relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-indigo-950/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          <div className="relative group shrink-0">
            <div className="w-48 h-48 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-rose-500 p-1 shadow-2xl shadow-indigo-500/20">
              <div className="w-full h-full rounded-[1.4rem] bg-slate-950 flex items-center justify-center overflow-hidden relative">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-800"><User size={80} /></div>
                )}
                {!isPreviewMode && (
                  <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <Camera className="text-white" size={32} />
                  </button>
                )}
              </div>
            </div>
            {profile.avatar && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 p-2 rounded-full border-4 border-slate-950 shadow-lg">
                <Check size={16} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Service & Ops Excellence
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Verified AI Expert
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-slate-100 mb-4 tracking-tight">
              Londiwe <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Nxele</span>
            </h2>

            {/* Editable Contact Row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-400" />
                {isEditing ? (
                  <input 
                    type="text" 
                    className="bg-slate-900/50 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-200" 
                    value={profile.email} 
                    onChange={e => setProfile({...profile, email: e.target.value})}
                  />
                ) : <span>{profile.email}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-indigo-400" />
                {isEditing ? (
                  <input 
                    type="text" 
                    className="bg-slate-900/50 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-200" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                  />
                ) : <span>{profile.phone}</span>}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-indigo-400" />
                {isEditing ? (
                  <input 
                    type="text" 
                    className="bg-slate-900/50 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-200" 
                    value={profile.location} 
                    onChange={e => setProfile({...profile, location: e.target.value})}
                  />
                ) : <span>{profile.location}</span>}
              </div>
            </div>

            {/* Branding Statement */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 group relative transition-all hover:bg-white/10">
              <div className="flex justify-between items-center mb-2">
                <p className="text-indigo-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} /> Personal Brand Statement
                </p>
              </div>
              
              {isEditing ? (
                <textarea
                  className="w-full bg-slate-900 border border-indigo-500/30 rounded-lg p-3 text-slate-200 text-sm focus:outline-none min-h-[100px]"
                  value={profile.brandStatement}
                  onChange={(e) => setProfile({...profile, brandStatement: e.target.value})}
                />
              ) : (
                <p className="text-xl text-slate-200 font-medium italic leading-relaxed">
                  "{profile.brandStatement}"
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button 
                onClick={downloadResume}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all shadow-2xl transform active:scale-95 ${
                  profile.resumeData 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40' 
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <FileText size={20} /> {profile.resumeData ? 'Download Resume' : 'Resume Required'}
              </button>
            </div>
            {profile.resumeName && (
              <p className="mt-3 text-[10px] text-slate-500 flex items-center gap-1 justify-center md:justify-start font-bold uppercase tracking-widest">
                <Check size={12} className="text-emerald-500" /> Attached: {profile.resumeName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-16">
        {/* Project Folders / Digital Archive Section */}
        <section className="space-y-8 px-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-black text-slate-100 flex items-center gap-3">
                <Archive className="text-amber-400" size={32} /> Digital <span className="text-amber-500">Archive</span>
              </h3>
              <p className="text-slate-500 text-sm mt-2">Organized professional resources, certificates, and research vaults.</p>
            </div>
            {isEditing && (
              <button 
                onClick={addFolder}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white rounded-xl text-xs font-black transition-all border border-amber-500/20"
              >
                <FolderPlus size={14} /> Create Folder
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(profile.folders || []).map((folder) => (
              <div key={folder.id} className="glass-morphism rounded-[2rem] border border-white/5 overflow-hidden transition-all hover:border-amber-500/30">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleFolder(folder.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                      <Folder size={24} />
                    </div>
                    <div>
                      {isEditing ? (
                        <input 
                          className="bg-transparent border-none focus:ring-0 text-lg font-bold text-slate-100 p-0"
                          value={folder.name}
                          onClick={e => e.stopPropagation()}
                          onChange={e => setProfile(prev => ({
                            ...prev,
                            folders: (prev.folders || []).map(f => f.id === folder.id ? { ...f, name: e.target.value } : f)
                          }))}
                        />
                      ) : (
                        <h4 className="text-lg font-bold text-slate-100">{folder.name}</h4>
                      )}
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {(groupedProjects.categorized[folder.id]?.length || 0) + folder.items.length} Units
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <button 
                        onClick={e => { e.stopPropagation(); removeFolder(folder.id); }}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    {expandedFolders.has(folder.id) ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-500" />}
                  </div>
                </div>

                {expandedFolders.has(folder.id) && (
                  <div className="px-6 pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="h-px bg-white/5 mb-2" />
                    
                    {/* Render Projects assigned to this folder */}
                    {groupedProjects.categorized[folder.id]?.length > 0 && (
                      <div className="space-y-3">
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-1">Projects</p>
                         <div className="grid grid-cols-1 gap-4">
                           {groupedProjects.categorized[folder.id].map(proj => (
                             <ProjectCard key={proj.id} proj={proj} compact />
                           ))}
                         </div>
                      </div>
                    )}

                    {/* Render Resources */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest px-1">Resources</p>
                      {folder.items.map((item) => (
                        <div key={item.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5 hover:bg-slate-900 transition-all">
                          <div className="flex items-center gap-3 flex-1">
                            <LinkIcon size={14} className="text-slate-600" />
                            {isEditing ? (
                              <div className="flex-1 space-y-1">
                                <input 
                                  className="w-full bg-transparent text-xs font-bold text-slate-200 p-0 border-none focus:ring-0"
                                  value={item.title}
                                  onChange={e => updateFolderItem(folder.id, item.id, { title: e.target.value })}
                                />
                                <input 
                                  className="w-full bg-transparent text-[10px] text-slate-500 p-0 border-none focus:ring-0"
                                  value={item.link}
                                  onChange={e => updateFolderItem(folder.id, item.id, { link: e.target.value })}
                                />
                              </div>
                            ) : (
                              <a href={item.link} target="_blank" rel="noreferrer" className="flex-1">
                                <p className="text-sm font-bold text-slate-300 group-hover:text-amber-400 transition-colors">{item.title}</p>
                                <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{item.link}</p>
                              </a>
                            )}
                          </div>
                          {isEditing && (
                            <button 
                              onClick={() => removeFolderItem(folder.id, item.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {isEditing && (
                      <button 
                        onClick={() => addItemToFolder(folder.id)}
                        className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-amber-400 hover:border-amber-400/30 transition-all"
                      >
                        <FilePlus size={14} /> Add Resource
                      </button>
                    )}

                    {(folder.items.length === 0 && !groupedProjects.categorized[folder.id]?.length) && !isEditing && (
                      <div className="text-center py-4">
                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest italic">Folder is empty</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* AI Capstone Showcase Section */}
        <section className="space-y-8">
          <div className="flex justify-between items-center px-2">
            <div>
              <h3 className="text-3xl font-black flex items-center gap-3 text-slate-100">
                <Rocket size={32} className="text-rose-400" /> AI Capstone <span className="text-rose-500">Showcase</span>
              </h3>
              <p className="text-slate-500 text-sm mt-2">Main highlight solutions and context-aware agents.</p>
            </div>
            {isEditing && (
              <button 
                onClick={addProject}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-xs font-black transition-all border border-indigo-500/20"
              >
                <Plus size={14} /> Add Project
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupedProjects.uncategorized.map((proj) => (
              <ProjectCard key={proj.id} proj={proj} />
            ))}
            {groupedProjects.uncategorized.length === 0 && !isEditing && (
              <div className="col-span-full py-20 text-center glass-morphism rounded-[2.5rem] border border-dashed border-white/10">
                <LayoutGrid className="mx-auto text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No highlight projects assigned</p>
              </div>
            )}
          </div>
        </section>

        {/* Professional Core Section */}
        <section className="space-y-8 px-2">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-3xl font-black text-slate-100 flex items-center gap-3">
                <Award className="text-indigo-400" size={32} /> Professional <span className="text-indigo-500">Core</span>
              </h3>
              <p className="text-slate-500 text-sm mt-2">Essential competencies driving operational and creative excellence.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <span>Performance Matrix</span>
              <div className="w-12 h-0.5 bg-slate-800" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.name} className="group glass-morphism p-6 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute -top-12 -right-12 w-24 h-24 bg-${skill.color}-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-${skill.color}-500/10 border border-${skill.color}-500/20 text-${skill.color}-400 group-hover:scale-110 transition-transform`}>
                    <skill.icon size={24} />
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest text-${skill.color}-400`}>{skill.label}</span>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <Star size={10} className="fill-current text-amber-500" />
                      <span className="text-xs font-bold text-slate-300">{skill.level}%</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-100 mb-2">{skill.name}</h4>
                
                {/* Progress Indicator */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-4 border border-white/5">
                  <div 
                    className={`h-full bg-gradient-to-r from-slate-800 to-${skill.color}-500 transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map(tag => (
                    <span key={tag} className="text-[9px] px-2.5 py-1 rounded-lg bg-slate-950/50 border border-white/5 text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-300 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Connections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 space-y-4">
             <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
               <Zap className="text-amber-400" size={20} /> Professional Presence
             </h3>
             <div className="space-y-3 pt-2">
               <div className="flex items-center gap-4 group">
                 <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                   <Linkedin size={20} />
                 </div>
                 {isEditing ? (
                   <input 
                     type="text" 
                     className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 w-full" 
                     value={profile.linkedinUrl} 
                     onChange={e => setProfile({...profile, linkedinUrl: e.target.value})}
                   />
                 ) : (
                   <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors truncate">
                    {profile.linkedinUrl?.replace('https://', '')}
                   </a>
                 )}
               </div>
               <div className="flex items-center gap-4 group">
                 <div className="p-3 bg-slate-900 rounded-xl text-slate-200 group-hover:scale-110 transition-transform">
                   <Github size={20} />
                 </div>
                 {isEditing ? (
                   <input 
                     type="text" 
                     className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 w-full" 
                     value={profile.githubUrl} 
                     onChange={e => setProfile({...profile, githubUrl: e.target.value})}
                   />
                 ) : (
                   <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors truncate">
                    {profile.githubUrl?.replace('https://', '')}
                   </a>
                 )}
               </div>
             </div>
          </div>

          <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-r from-slate-900 to-indigo-950/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
              <MessageSquare size={120} />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <MessageSquare className="text-indigo-400" size={24} /> Endorsements
            </h3>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 italic text-slate-300 relative text-sm leading-relaxed">
              <span className="absolute -top-4 left-6 text-6xl text-indigo-500/10 font-serif">"</span>
              Londiwe consistently delivers high-quality operational support with a focus on integrity and professional representation. Her transition into AI solutions is impressive.
              <div className="mt-4 flex items-center gap-3 not-italic">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800" />
                <div>
                  <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Career Mentor</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">CAPACITI Programme</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
