import { z } from "zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../auth.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { onInvalid } from "../../../lib/form";
import { useAuth } from "../useAuth";

import "./RegisterForm.css";
import nameIcon from "../../../assets/name-icon.png"
import passwordIcon from "../../../assets/password-icon.png"
import usernameIcon from "../../../assets/username-icon.png"

type RegisterFormData = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
    const { registerMutation } = useAuth()
    const { register, handleSubmit } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema)
    });

    function onValid(data: RegisterFormData) {
        registerMutation.mutate(data)
    }

    return (
        <div className="register-form-wrapper">
            <h2 className="form-title">Create Account</h2>
            
            <form className="register-form" onSubmit={handleSubmit(onValid, onInvalid)}>
                
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <div className="input-container">
                        <img src={usernameIcon} alt="Username Icon" className="input-icon" />
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter your username" 
                            {...register("username")}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-container">
                        <img src={passwordIcon} alt="Password Icon" className="input-icon" />
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="Enter your password" 
                            {...register("password")}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Name</label>
                    <div className="input-container">
                        <img src={nameIcon} alt="Name Icon" className="input-icon" />
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter your full name" 
                            {...register("name")}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Register
                </button>
                
                <div className="form-footer">
                    <span>Already have an account? </span>
                    <Link to={"/login"} className="login-link">Sign in</Link>
                </div>

            </form>
        </div>
    );
}