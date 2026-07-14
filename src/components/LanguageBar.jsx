import { colorForLanguage } from '../utils/format';

export default function LanguageBar({ languages }) {
  if (!languages || languages.length === 0) {
    return <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>No language data available yet.</p>;
  }

  const total = languages.reduce((sum, l) => sum + l.count, 0);

  return (
    <div>
      <div className="lang-bar-track">
        {languages.map((l) => (
          <div
            key={l.language}
            className="lang-bar-segment"
            style={{
              width: `${(l.count / total) * 100}%`,
              background: colorForLanguage(l.language),
            }}
            title={`${l.language}: ${l.count} repo${l.count > 1 ? 's' : ''}`}
          />
        ))}
      </div>
      <div className="lang-legend">
        {languages.map((l) => (
          <span className="lang-legend__item" key={l.language}>
            <span className="lang-legend__swatch" style={{ background: colorForLanguage(l.language) }} />
            {l.language} · {l.count}
          </span>
        ))}
      </div>
    </div>
  );
}
