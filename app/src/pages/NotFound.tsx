import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
      <img alt="404" src="/client/assets/images/error-404.svg" style={{ maxWidth: 400 }} />
      <h2>Page Not Found</h2>
      <Link className="button-outline" to="/">Back to Home</Link>
    </div>
  );
}
