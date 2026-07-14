import { Link } from 'react-router-dom';
import { baseURL } from '../api/client';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="brand">
            <span className="brand__prompt">$</span>
            <span>github-analyzer</span>
            <span className="brand__cursor" />
          </div>
        </Link>
        <div className="navbar__meta">api: {baseURL.replace(/^https?:\/\//, '')}</div>
      </div>
    </header>
  );
}
