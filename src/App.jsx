import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Library from './pages/Library.jsx';
import StoryDetail from './pages/StoryDetail.jsx';
import RhymeDetail from './pages/RhymeDetail.jsx';
import SongDetail from './pages/SongDetail.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/pohadky/:slug" element={<StoryDetail />} />
        <Route path="/rikadla/:slug" element={<RhymeDetail />} />
        <Route path="/pisnicky/:slug" element={<SongDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
