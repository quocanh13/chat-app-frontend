import { LoginForm } from "../../features/auth/components/LoginForm";
import "./LoginPage.css";

export function LoginPage() {
  return (
    <main className="login-page-main">
      <div className="login-card">
        <LoginForm />
      </div>
    </main>
  );
}