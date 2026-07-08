import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import * as AuthApi from "./auth.api"
import { TOAST_TYPE } from "../../shared/types";
import { useToastStore } from "../../stores/toastStore";
import { useAuthStore } from "../../stores/authStore";
import { useApiErrorHandler } from "../../lib/api";

export function useAuth(){
    const navigate = useNavigate()
    const { addToast } = useToastStore()
    const { setToken } = useAuthStore()
    const { handleApiError } = useApiErrorHandler()
    const registerMutation = useMutation({
        mutationFn : AuthApi.register,
        onSuccess(data){
            addToast({
                type : TOAST_TYPE.SUCCESS, 
                message : "Account created successfully. Redirecting to the login page"
            })
            navigate("/login")
        },
        onError : handleApiError
    })

    const loginMutation = useMutation({
        mutationFn: AuthApi.login,
        onSuccess(data){
            addToast({
                type : TOAST_TYPE.SUCCESS, 
                message : "Login successfully. Redirecting to the chat page"
            })
            setToken(data.token)
        },
        onError : handleApiError
    })

    return {registerMutation, loginMutation}
}