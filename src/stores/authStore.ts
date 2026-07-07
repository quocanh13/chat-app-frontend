import { create } from "zustand"

interface Auth{
    token: string,
    id: number,
    username: string,
}

interface AuthStore{
    auth: Auth | null,
    setAuth: (auth: Auth | null) => void
}

export const useAuthStore = create<AuthStore>((set)=>({
    auth: null,
    setAuth(auth) {
        set({auth})
    },
}))