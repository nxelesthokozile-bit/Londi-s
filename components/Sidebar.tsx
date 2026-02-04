
import React from 'react';
import { LayoutDashboard, PenTool, Mic2, Library, Settings, Zap, HelpCircle, Briefcase, User } from 'lucide-react';
import { AppSection } from '../types';

interface SidebarProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onNavigate }) => {
  const primaryNav = [
    { id: AppSection.PORTFOLIO, label: 'My Portfolio', icon: User },
    { id: AppSection.DASHBOARD, label: 'Gadget Hub', icon: LayoutDashboard },
  ];

  const toolNav = [
    { id: AppSection.STUDIO, label: 'Gadget Studio', icon: PenTool },
    { id: AppSection.LIVE_COACH, label: 'Voice Assistant', icon: Mic2 },
    { id: AppSection.GALLERY, label: 'Analysis Archive', icon: Library },
  ];

  const secondaryNav = [
    { id: AppSection.SETTINGS, label: 'Settings', icon: Settings },
    { id: AppSection.HELP, label: 'Technical Specs', icon: HelpCircle },
  ];

  // Fix: Explicitly include 'key' in NavButton props to satisfy TypeScript's strict check for functional components defined in scope.
  const NavButton = ({ item }: { item: any; key?: React.Key }) => (
    <button
      onClick={() => onNavigate(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentSection === item.id
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`}
    >
      <item.icon size={18} />
      <span className="font-medium text-sm">{item.label}</span>
    </button>
  );

  return (
    <div className="w-64 h-screen glass-morphism border-r border-slate-800 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Zap className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-sm font-black text-white leading-tight">Londiwe Nxele</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">AI Solutions Portfolio</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Professional</p>
          <div className="space-y-1">
            {primaryNav.map(item => <NavButton key={item.id} item={item} />)}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Gadget Toolset</p>
          <div className="space-y-1">
            {toolNav.map(item => <NavButton key={item.id} item={item} />)}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">System</p>
          <div className="space-y-1">
            {secondaryNav.map(item => <NavButton key={item.id} item={item} />)}
          </div>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Project Tier</p>
          <p className="text-sm font-semibold text-slate-200">Capstone Final</p>
          <div className="mt-3 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
