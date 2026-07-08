import { z } from "zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterFormSchema } from "../auth.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { onInvalid } from "../../../lib/form";
import { useAuth } from "../useAuth";
import { Loader } from "../../../shared/loader/Loader"; // Sử dụng Loader dùng chung

import "./RegisterForm.css";
import nameIcon from "../../../assets/name-icon.png"
import passwordIcon from "../../../assets/password-icon.png"
import usernameIcon from "../../../assets/username-icon.png"

type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export function RegisterForm() {
    const { registerMutation } = useAuth();
    const isLoading = registerMutation.isPending; // Trạng thái gửi request tạo tài khoản

    const { register, handleSubmit } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterFormSchema)
    });

    function onValid(data: RegisterFormData) {
        registerMutation.mutate(data);
    }

    return (
        <div className="register-form-wrapper">
            <h2 className="form-title">Create Account</h2>
            
            <form className="register-form" onSubmit={handleSubmit(onValid, onInvalid)}>
                
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

                <div className="form-group">
                    <label className="form-label">Name</label>
                    <div className={`input-container ${isLoading ? "disabled" : ""}`}>
                        <img src={nameIcon} alt="Name Icon" className="input-icon" />
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter your full name" 
                            disabled={isLoading}
                            {...register("name")}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? (
                        <span className="loader-container">
                            <Loader /> Registering...
                        </span>
                    ) : (
                        "Register"
                    )}
                </button>
                
                <div className="form-footer">
                    <span>Already have an account? </span>
                    <Link 
                        to={isLoading ? "#" : "/login"} 
                        className={`login-link ${isLoading ? "disabled-link" : ""}`}
                    >
                        Sign in
                    </Link>
                </div>

            </form>
        </div>
    );
}