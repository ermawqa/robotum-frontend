import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About'; 
import Join from './pages/Join-us';
import Events from './pages/Events';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/join" element={<Join />} />
      <Route path="/events" element={<Events />} />
    </Routes>
  );
}