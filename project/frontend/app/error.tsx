'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <div className="state error">
        ⚠ Something went wrong{error?.message ? `: ${error.message}` : '.'}
        <div className="row" style={{ justifyContent: 'center', marginTop: 8 }}>
          <button className="btn btn-sm btn-ghost" onClick={reset}>
            Retry
          </button>
        </div>
      </div>
    </main>
  );
}
