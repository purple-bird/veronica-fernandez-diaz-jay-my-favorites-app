import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div>
      <p>Page not found.</p>
      <Link to={'/'}>Return to Home Page</Link>
    </div>
  );
}

export default NotFoundPage;
