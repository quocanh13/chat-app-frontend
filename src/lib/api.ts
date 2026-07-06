import { ApiError, TOAST_TYPE } from "../shared/types";
import { useAuthStore } from "../stores/authStore"
import { useToastStore } from "../stores/toastStore";


export function request(
    url: string,
    options: RequestInit = {}
){
    const { token } = useAuthStore.getState()
    const headers = new Headers(options.headers)
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(url, {...options, headers})
}

export function handleApiError(error: ApiError){
    const {addToast} = useToastStore.getState()
    if(error.message == "Failed to fetch")
        error.message = "Failed to connect to server, try again"
    addToast({type : TOAST_TYPE.ERROR, message : error.message})
}