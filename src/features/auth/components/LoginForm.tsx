import { z } from "zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../auth.dto"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { onInvalid } from "../../../lib/form";
import { useAuth } from "../useAuth";
import { Loader } from "../../../shared/loader/Loader";  

import "./LoginForm.css";
import passwordIcon from "../../../assets/password-icon.png"
import usernameIcon from "../../../assets/username-icon.png"

type LoginFormData = z.infer<typeof LoginSchema>;

export function LoginForm() {
    const { loginMutation } = useAuth();
    const isLoading = loginMutation.isPending; 

    const { register, handleSubmit } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema)
    });

    function onValid(data: LoginFormData) {
        loginMutation.mutate(data);
    }

    return (
        <div className="login-form-wrapper">
            <h2 className="form-title">Sign In</h2>
            
            <form className="login-form" onSubmit={handleSubmit(onValid, onInvalid)}>
                
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <div className={`input-container ${isLoading ? "disabled" : ""}`}>
                        <img src={usernameIcon} alt="Username Icon" className="input-icon" />
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter your username" 
                            disabled={isLoading}
                            {...register("username")}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className={`input-container ${isLoading ? "disabled" : ""}`}>
                        <img src={passwordIcon} alt="Password Icon" className="input-icon" />
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="Enter your password" 
                            disabled={isLoading}
                            {...register("password")}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? (
                        <span className="loader-container">
                            <Loader /> Logging in...
                        </span>
                    ) : (
                        "Login"
                    )}
                </button>
                
                <div className="form-footer">
                    <span>Don't have an account? </span>
                    <Link 
                        to={isLoading ? "#" : "/register"} 
                        className={`register-link ${isLoading ? "disabled-link" : ""}`}
                    >
                        Register
                    </Link>
                </div>

            </form>
        </div>
    );
}