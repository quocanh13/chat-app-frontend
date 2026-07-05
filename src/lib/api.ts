import { useAuthStore } from "../stores/authStore"


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