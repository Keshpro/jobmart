import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* අනාගතයේදී අපි මෙතනට Login සහ Register routes එකතු කරනවා */}
      </Routes>
    </Router>
  );
}

export default App;