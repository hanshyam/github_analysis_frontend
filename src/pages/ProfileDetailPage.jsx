import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import LanguageBar from '../components/LanguageBar';
import { analyzeProfile, deleteProfile, getProfile } from '../api/client';
import { formatCount, parseLanguages, timeAgo } from '../utils/format';

export default function ProfileDetailPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProfile(username);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRefresh() {
    setRefreshing(true);
    setError('');
    try {
      const data = await analyzeProfile(username);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete the stored analysis for @${username}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProfile(username);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="section">
      <div className="container">
        <Link to="/" className="back-link">← back to all profiles</Link>

        {error && <ErrorBanner message={error} />}

        {loading ? (
          <Loader label="loading profile" />
        ) : !profile ? null : (
          <>
            <div className="profile-header">
              <img className="profile-header__avatar" src={profile.avatar_url} alt="" />
              <div>
                <h1 className="profile-header__name">{profile.name || profile.username}</h1>
                <div className="profile-header__username">@{profile.username}</div>
                {profile.bio && <p className="profile-header__bio">{profile.bio}</p>}
                <div className="profile-header__meta">
                  {profile.company && <span>🏢 {profile.company}</span>}
                  {profile.location && <span>📍 {profile.location}</span>}
                  {profile.blog && (
                    <span>
                      🔗 <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer">{profile.blog}</a>
                    </span>
                  )}
                  <span>
                    🐙 <a href={profile.html_url} target="_blank" rel="noreferrer">view on GitHub</a>
                  </span>
                  <span>refreshed {timeAgo(profile.last_refreshed_at)}</span>
                </div>
              </div>
              <div className="profile-header__actions">
                <button className="btn btn--primary" onClick={handleRefresh} disabled={refreshing}>
                  {refreshing ? 'refreshing…' : '↻ re-analyze'}
                </button>
                <button className="btn btn--danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'deleting…' : '🗑 delete'}
                </button>
              </div>
            </div>

            <div className="stat-grid">
              <StatBlock label="Public repos" value={formatCount(profile.public_repos)} />
              <StatBlock label="Followers" value={formatCount(profile.followers)} tone="green" />
              <StatBlock label="Following" value={formatCount(profile.following)} />
              <StatBlock label="Total stars" value={formatCount(profile.total_stars)} tone="amber" />
              <StatBlock label="Total forks" value={formatCount(profile.total_forks)} />
              <StatBlock label="Follower ratio" value={profile.follower_following_ratio} />
              <StatBlock label="Account age" value={`${profile.account_age_years}y`} />
              <StatBlock label="Activity score" value={profile.activity_score} tone="green" />
            </div>

            <div className="panel">
              <h3 className="panel__title">Top languages</h3>
              <LanguageBar languages={parseLanguages(profile.top_languages)} />
            </div>

            {profile.most_starred_repo && (
              <div className="panel">
                <h3 className="panel__title">Most starred repo</h3>
                <div className="repo-highlight">
                  <a href={`${profile.html_url}/${profile.most_starred_repo}`} target="_blank" rel="noreferrer">
                    {profile.username}/{profile.most_starred_repo}
                  </a>
                  <span className="repo-highlight__star">★ {formatCount(profile.most_starred_repo_stars)}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatBlock({ label, value, tone }) {
  return (
    <div className="stat-block">
      <div className="stat-block__label">{label}</div>
      <div className={`stat-block__value${tone ? ` stat-block__value--${tone}` : ''}`}>{value}</div>
    </div>
  );
}
