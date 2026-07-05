import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // දැනට ටෝකන් එක නැත්නම් ලොගින් එකට හරවා යවයි
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Dummy data (පසුව API එකෙන් ගන්න පුළුවන්)
  const stats = [
    { id: 1, name: 'Active Job Postings', value: '12', icon: '💼', color: 'bg-emerald-50 text-emerald-700' },
    { id: 2, name: 'Total Applicants', value: '148', icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { id: 3, name: 'Interviews Scheduled', value: '6', icon: '📅', color: 'bg-amber-50 text-amber-700' },
  ];

  const recentJobs = [
    { id: 1, title: 'Full Stack .NET Developer', type: 'Full-time', applicants: 42, status: 'Active' },
    { id: 2, title: 'React.js Frontend Engineer', type: 'Remote', applicants: 89, status: 'Active' },
    { id: 3, title: 'UI/UX Designer', type: 'Contract', applicants: 17, status: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-8 font-sans">
      {/* Welcome Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A2B4A] tracking-tight">Recruiter Dashboard</h1>
          <p className="text-sm text-[#6B7A8D] mt-1">Manage your job postings and track incoming candidates.</p>
        </div>
        <button className="bg-[#4A7C59] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#3D6649] transition shadow-sm flex items-center gap-2">
          <span>+</span> Post a New Job
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white border border-[#EDE8DF] rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7A8D]">{stat.name}</p>
              <h3 className="text-3xl font-bold text-[#1A2B4A] mt-2">{stat.value}</h3>
            </div>
            <div className={`text-2xl p-4 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Section: Recent Job Postings */}
      <div className="bg-white border border-[#EDE8DF] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1A2B4A]">Recent Job Postings</h2>
          <button className="text-sm font-medium text-[#4A7C59] hover:underline">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EDE8DF] text-sm text-[#6B7A8D] font-medium">
                <th className="pb-3">Job Title</th>
                <th className="pb-3">Job Type</th>
                <th className="pb-3">Applicants</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8DF]">
              {recentJobs.map((job) => (
                <tr key={job.id} className="text-sm text-[#1A2B4A] hover:bg-[#FBFBFA] transition">
                  <td className="py-4 font-semibold">{job.title}</td>
                  <td className="py-4 text-[#6B7A8D]">{job.type}</td>
                  <td className="py-4">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium text-gray-700">
                      {job.applicants} Applicants
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      job.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-xs font-semibold border border-[#1A2B4A] text-[#1A2B4A] px-4 py-1.5 rounded-full hover:bg-[#1A2B4A] hover:text-white transition">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;