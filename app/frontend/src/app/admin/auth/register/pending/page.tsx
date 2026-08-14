import T from "@/components/shared/T";
import LanguageToggle from "@/components/shared/LanguageToggle";

export default function RegisterPendingPage() {
  return (
    <div className="page-account">
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <LanguageToggle />
      </div>
      <div className="form-account">
        <h2 className="inner-title"><T ns="adminAuth" k="accountCreated" /></h2>
        <p className="inner-desc"><T ns="adminAuth" k="waitForApproval" /></p>

        <div className="inner-more">
          <span><T ns="adminAuth" k="alreadyApproved" /></span>
          <a href="/admin/auth/login"><T ns="adminAuth" k="login" /></a>
        </div>
      </div>
    </div>
  );
}
