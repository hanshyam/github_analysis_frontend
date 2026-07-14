import { useState } from 'react';

export default function SearchBar({ onAnalyze, loading }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const username = value.trim();
    if (!username || loading) return;
    onAnalyze(username);
  }

  return (
    <form className="terminal" onSubmit={handleSubmit}>
      <span className="terminal__prompt">$</span>
      <span className="terminal__cmd">analyze</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="octocat"
        aria-label="GitHub username to analyze"
        autoComplete="off"
        spellCheck={false}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !value.trim()}>
        {loading ? 'running…' : 'run'}
      </button>
    </form>
  );
}
