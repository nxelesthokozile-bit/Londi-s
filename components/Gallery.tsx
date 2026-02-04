
import React, { useState, useEffect } from 'react';
import { getAllCampaigns, deleteCampaign } from '../services/storageService';
import { Campaign } from '../types';
import { Trash2, ExternalLink, Calendar, Search } from 'lucide-react';

const Gallery: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getAllCampaigns());
  }, []);

  const handleDelete = (id: string) => {
    deleteCampaign(id);
    setCampaigns(getAllCampaigns());
  };

  if (campaigns.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Search size={48} strokeWidth={1.5} />
        <h2 className="text-xl font-medium">No campaigns found</h2>
        <p>Start a new project in the Content Studio to see it here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((campaign) => (
        <div key={campaign.id} className="glass-morphism rounded-2xl overflow-hidden group border border-slate-800/50 hover:border-indigo-500/30 transition-all">
          <div className="h-40 bg-slate-900 flex items-center justify-center relative">
            {campaign.assets.find(a => a.type === 'image') ? (
              <img 
                src={campaign.assets.find(a => a.type === 'image')?.content} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                alt="Hero"
              />
            ) : (
              <div className="text-slate-700 font-bold text-4xl">AI</div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => handleDelete(campaign.id)}
                className="p-2 bg-slate-950/80 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg mb-1 truncate">{campaign.name || 'Untitled Campaign'}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <Calendar size={14} />
              {new Date(campaign.createdAt).toLocaleDateString()}
              <span className="mx-1">•</span>
              {campaign.assets.length} Assets
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from(new Set(campaign.assets.map(a => a.type))).map(type => (
                <span key={type} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] uppercase font-bold text-slate-400 border border-slate-700">
                  {type}
                </span>
              ))}
            </div>
            <button className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl border border-indigo-600/20 text-sm font-semibold transition-all flex items-center justify-center gap-2">
              View Details <ExternalLink size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
