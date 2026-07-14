export default function Loader({ label = 'loading' }) {
  return (
    <span className="loader">
      <span className="loader__dot" />
      <span className="loader__dot" />
      <span className="loader__dot" />
      {label}
    </span>
  );
}
