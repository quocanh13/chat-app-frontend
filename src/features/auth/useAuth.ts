import type {z} from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import * as AuthApi from "./auth.api"
import { ApiError, TOAST_TYPE } from "../../shared/types";
import type { LoginSchema, RegisterSchema } from "./auth.dto";
import { useToastStore } from "../../stores/toastStore";

type RegisterInput = z.infer<typeof RegisterSchema>;
type LoginInput = z.infer<typeof LoginSchema>;

export function useAuth(){
    const navigate = useNavigate()
    const { addToast } = useToastStore()
    const registerMutation = useMutation({
        mutationFn : AuthApi.register,
        onSuccess(data){
            addToast({
                type : TOAST_TYPE.SUCCESS, 
                message : "Account created successfully. Redirecting to the login page"
            })
            navigate("/login")
        },
        onError(error: ApiError){
            addToast({type : TOAST_TYPE.ERROR, message : error.message})
        }
    })


    return {registerMutation}
}