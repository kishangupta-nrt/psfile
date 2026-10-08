import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-card">
          <div style={{ fontWeight: 800, fontSize: 20 }}>NRT-SMS</div>
          <h2>Forgot password?</h2>
          <p className="muted">
            Self-service password reset isn&apos;t available yet. Please ask your reseller or
            administrator to reset it for you, then change it after logging in.
          </p>
          <div className="row" style={{ marginTop: 12 }}>
            <Link href="/authentication" className="btn btn-sm">
              Back to login
            </Link>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="art">
          <h2>Bulk SMS • Voice • WhatsApp</h2>
          <p>Send campaigns, manage contacts, track delivery reports and handle credits from one panel.</p>
        </div>
      </div>
    </div>
  );
}
