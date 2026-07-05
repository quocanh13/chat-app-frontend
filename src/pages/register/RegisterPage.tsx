import { RegisterForm } from "../../features/auth/components/RegisterForm";
import "./RegisterPage.css";

export function RegisterPage() {
  return (
    <main className="register-page-main">
      <div className="register-card">
        <RegisterForm />
      </div>
    </main>
  );
}