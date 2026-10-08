import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <div className="state">
        <h2>Page not found</h2>
        <p className="muted">The page you asked for doesn&apos;t exist.</p>
        <Link href="/dashboard" className="btn btn-sm" style={{ display: 'inline-block', marginTop: 8 }}>
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
