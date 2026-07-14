import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProfileDetailPage from './pages/ProfileDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="footer">
          github-profile-analyzer · data via the GitHub public API
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="container section">
      <div className="state-block">
        <div className="state-block__glyph">404</div>
        <strong>Route not found</strong>
      </div>
    </div>
  );
}
