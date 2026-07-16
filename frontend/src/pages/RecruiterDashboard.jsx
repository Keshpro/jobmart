import { useState } from 'react';
import { LayoutDashboard, Briefcase, Users, FileText, Settings, LogOut } from 'lucide-react';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
    { id: 'applicants', label: 'Applicants', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-10 text-brand-green">Recruiter Portal</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full gap-3 p-3 rounded-lg ${activeTab === item.id ? 'bg-brand-green' : 'hover:bg-slate-800'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome back, Recruiter!</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500">Active Jobs</h3>
            <p className="text-4xl font-bold">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500">Total Applicants</h3>
            <p className="text-4xl font-bold">145</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500">Pending Reviews</h3>
            <p className="text-4xl font-bold text-brand-green">28</p>
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold mb-4">Top Ranked Applicants</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b">
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Applied For</th>
                <th className="pb-3">AI Score</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-0">
                <td className="py-4 font-semibold">Kamal Perera</td>
                <td className="py-4">Software Engineer</td>
                <td className="py-4 text-brand-green font-bold">95%</td>
                <td className="py-4"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Shortlisted</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;