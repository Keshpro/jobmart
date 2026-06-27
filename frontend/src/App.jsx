import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// අපි ඉස්සරහට හදන Pages (දැනට Error එනවා නම් මේවා comment කරලා තියන්න පුළුවන්)
// import Login from './pages/Login';
// import CandidatePortal from './pages/CandidatePortal';
// import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar එකක් පස්සේ මෙතනට දාමු */}
        <h1>AI-Powered Recruitment Platform</h1>
        
        <Routes>
          {/* මෙතනට තමා Pages ටික එන්නේ */}
          <Route path="/" element={<h2>Home / Login Page එක මෙතනට එයි</h2>} />
          <Route path="/candidate" element={<h2>Candidate Portal එක මෙතනට එයි</h2>} />
          <Route path="/admin" element={<h2>Admin Dashboard එක මෙතනට එයි</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;