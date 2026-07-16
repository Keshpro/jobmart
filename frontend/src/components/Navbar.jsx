import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
    <div className="text-2xl font-bold text-brand-green">JobMart AI</div>
    <div className="flex gap-6">
      <Link to="/" className="text-slate-600 hover:text-brand-green">Home</Link>
      <Link to="/candidate" className="text-slate-600 hover:text-brand-green">Candidate</Link>
      <Link to="/recruiter" className="text-slate-600 hover:text-brand-green">Recruiter</Link>
      <Link to="/login" className="bg-brand-green text-white px-4 py-2 rounded">Login</Link>
    </div>
  </nav>
);

export default Navbar;