import Navbar from '../components/Navbar';
import { Users, Briefcase, Activity, Shield } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <h2 className="text-3xl font-bold text-slate-800 mb-6">System Administration</h2>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase">Total Users</p>
              <p className="text-3xl font-black text-slate-800">1,204</p>
            </div>
            <Users className="text-blue-500 h-10 w-10 opacity-80" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand-green flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase">Active Jobs</p>
              <p className="text-3xl font-black text-slate-800">86</p>
            </div>
            <Briefcase className="text-brand-green h-10 w-10 opacity-80" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase">AI Scans Today</p>
              <p className="text-3xl font-black text-slate-800">342</p>
            </div>
            <Activity className="text-purple-500 h-10 w-10 opacity-80" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase">System Status</p>
              <p className="text-xl font-bold text-green-600">Online</p>
            </div>
            <Shield className="text-slate-800 h-10 w-10 opacity-80" />
          </div>
        </div>

        {/* User Role Management Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-slate-800 p-4">
            <h3 className="text-lg font-bold text-white">User Role Management (Mock Data)</h3>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-4 font-semibold">User ID</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-slate-800 font-medium">101</td>
                  <td className="p-4 text-slate-600">johndoe@email.com</td>
                  <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">Candidate</span></td>
                  <td className="p-4"><button className="text-brand-green font-semibold text-sm hover:underline">Edit Role</button></td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-slate-800 font-medium">102</td>
                  <td className="p-4 text-slate-600">sarah.smith@company.com</td>
                  <td className="p-4"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">Recruiter</span></td>
                  <td className="p-4"><button className="text-brand-green font-semibold text-sm hover:underline">Edit Role</button></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 text-slate-800 font-medium">1</td>
                  <td className="p-4 text-slate-600">admin@gmail.com</td>
                  <td className="p-4"><span className="bg-slate-800 text-white px-2 py-1 rounded text-xs font-bold">Admin</span></td>
                  <td className="p-4"><button className="text-brand-green font-semibold text-sm hover:underline">Edit Role</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;