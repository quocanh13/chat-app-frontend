import { create } from "zustand";

interface User{
    userId: number,
    username: string,
    name: string,
    avatarURL: string,
}

interface SetAuthInput{
    token?: string,
    user?: User
}

interface AuthStore{
    token?: string,
    user?: User

    setAuth : (input: SetAuthInput) => void,
}

export const useAuthStore = create<AuthStore>((set)=>({
    setAuth : (input: SetAuthInput) => {
        set(input)
    }
}))