import { Link } from 'react-router-dom';
import { formatCount, timeAgo } from '../utils/format';
import EmptyState from './EmptyState';

export default function ProfileList({ profiles }) {
  if (!profiles || profiles.length === 0) {
    return (
      <EmptyState
        glyph="∅"
        title="No profiles analyzed yet"
        hint='Run "analyze <username>" above to fetch and store your first profile.'
      />
    );
  }

  return (
    <div className="profile-list">
      {profiles.map((p) => (
        <Link key={p.username} to={`/profile/${p.username}`} className="profile-row">
          <img
            className="profile-row__avatar"
            src={p.avatar_url}
            alt=""
            loading="lazy"
          />
          <div className="profile-row__main">
            <div className="profile-row__name">{p.name || p.username}</div>
            <div className="profile-row__username">@{p.username}</div>
            {p.bio && <div className="profile-row__bio">{p.bio}</div>}
          </div>
          <div className="profile-row__stats">
            <span className="stat-pill stat-pill--add">+{formatCount(p.followers)} followers</span>
            <span className="stat-pill">{formatCount(p.public_repos)} repos</span>
            <span className="stat-pill stat-pill--del">★{formatCount(p.total_stars)}</span>
          </div>
          <div className="profile-row__time">{timeAgo(p.last_refreshed_at || p.analyzed_at)}</div>
        </Link>
      ))}
    </div>
  );
}
