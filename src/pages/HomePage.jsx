import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProfileList from '../components/ProfileList';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import { analyzeProfile, getAllProfiles } from '../api/client';

export default function HomePage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('analyzed_at');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadProfiles = useCallback(async () => {
    setLoadingList(true);
    setError('');
    try {
      const res = await getAllProfiles({ sortBy, order, page, limit: 10 });
      setProfiles(res.data);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  }, [sortBy, order, page]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  async function handleAnalyze(username) {
    setAnalyzing(true);
    setError('');
    try {
      const profile = await analyzeProfile(username);
      navigate(`/profile/${profile.username}`);
    } catch (err) {
      setError(err.message);
      setAnalyzing(false);
    }
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="hero__eyebrow">public api · mysql · express</p>
          <h1>Analyze any GitHub profile.</h1>
          <p>
            Type a username to pull public data from the GitHub API, compute
            insights like activity score and top languages, and store the
            result for later lookup.
          </p>
          <SearchBar onAnalyze={handleAnalyze} loading={analyzing} />
          {error && (
            <div style={{ marginTop: 14 }}>
              <ErrorBanner message={error} />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">
              Analyzed profiles {total > 0 && `(${total})`}
            </h2>
            <div className="sort-controls">
              <span>sort</span>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                <option value="analyzed_at">recently analyzed</option>
                <option value="followers">followers</option>
                <option value="public_repos">repos</option>
                <option value="total_stars">stars</option>
                <option value="activity_score">activity score</option>
                <option value="username">username</option>
              </select>
              <select value={order} onChange={(e) => { setOrder(e.target.value); setPage(1); }}>
                <option value="desc">desc</option>
                <option value="asc">asc</option>
              </select>
            </div>
          </div>

          {loadingList ? (
            <Loader label="fetching stored profiles" />
          ) : (
            <>
              <ProfileList profiles={profiles} />
              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                    ← prev
                  </button>
                  <span>page {page} / {totalPages}</span>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                    next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
