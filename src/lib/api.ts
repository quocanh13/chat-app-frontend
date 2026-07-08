import { useNavigate } from "react-router-dom";
import { ApiError, TOAST_TYPE } from "../shared/types";
import { useAuthStore } from "../stores/authStore"
import { useToastStore } from "../stores/toastStore";


export function request(
    url: string,
    options: RequestInit = {}
){
    const { token } = useAuthStore.getState()
    options.credentials = "include"
    const headers = new Headers(options.headers)
    if(token)
        headers.set("Authorization", `Bearer ${token}`);

    return fetch(url, {...options, headers})
}

export function useApiErrorHandler(){
    const {addToast} = useToastStore.getState()
    const navigate = useNavigate()

    function handleApiError(error: ApiError){
        if(error.message == "Failed to fetch")
            error.message = "Failed to connect to server, try again"

        else if(error.code == "TOKEN_NOT_FOUND" || error.code == "INVALID_TOKEN"){
            addToast({
                type: TOAST_TYPE.ERROR, 
                message: "Invalid token, redirecting to login page. Please login again"
            })
            navigate("/login")
        } 
        
        else addToast({type : TOAST_TYPE.ERROR, message : error.message})
    }

    return {handleApiError}
}