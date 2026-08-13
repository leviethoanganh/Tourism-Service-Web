export default function RegisterPendingPage() {
  return (
    <div className="page-account">
      <div className="form-account">
        <h2 className="inner-title">Account has been created</h2>
        <p className="inner-desc">Please wait for administrator approval</p>

        <div className="inner-more">
          <span>Already approved?</span>
          <a href="/admin/auth/login">Login</a>
        </div>
      </div>
    </div>
  );
}
