
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, Users, Eye, Share2, TrendingUp, History } from 'lucide-react';
import { getAllCampaigns } from '../services/storageService';

const MOCK_DATA = [
  { name: 'Mon', reach: 4200, engagement: 2100 },
  { name: 'Tue', reach: 3500, engagement: 1800 },
  { name: 'Wed', reach: 2800, engagement: 9200 },
  { name: 'Thu', reach: 3100, engagement: 4200 },
  { name: 'Fri', reach: 2200, engagement: 5100 },
  { name: 'Sat', reach: 2900, engagement: 4100 },
  { name: 'Sun', reach: 3800, engagement: 4700 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="glass-morphism p-6 rounded-2xl border border-white/5 transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 text-${color}-400`}>
        <Icon size={24} />
      </div>
      <span className="flex items-center text-emerald-400 text-sm font-medium">
        {change} <ArrowUpRight size={16} />
      </span>
    </div>
    <p className="text-slate-400 text-sm mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-slate-100 tracking-tight">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  const campaigns = useMemo(() => getAllCampaigns(), []);
  const assetCount = useMemo(() => campaigns.reduce((acc, curr) => acc + curr.assets.length, 0), [campaigns]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">SmartGadgets Dashboard</h2>
          <p className="text-slate-400">Gadget orchestration analytics and live assistant tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <History size={16} /> Activity Log
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Impressions" value="1.4M" change="+14.2%" icon={Eye} color="indigo" />
        <StatCard title="Active Sessions" value={campaigns.length} change={`+${campaigns.length > 0 ? '1' : '0'}`} icon={TrendingUp} color="amber" />
        <StatCard title="Analyzed Devices" value={assetCount} change="+8.1%" icon={Share2} color="emerald" />
        <StatCard title="Unique Users" value="92.1K" change="+6.5%" icon={Users} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-8 rounded-3xl h-[420px] border border-white/5 shadow-xl">
          <h3 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-400" /> analysis velocity
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={MOCK_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="reach" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-morphism p-8 rounded-3xl h-[420px] border border-white/5 shadow-xl">
          <h3 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <Users size={18} className="text-emerald-400" /> user trends
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={MOCK_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#0f172a' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
