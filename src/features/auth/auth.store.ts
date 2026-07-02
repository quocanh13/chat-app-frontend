import { create } from "zustand";

interface SetAuthInput{
    token?: string,
}

interface AuthStore{
    token?: string,

    setAuth : (input: SetAuthInput) => void,
}

export const useAuthStore = create<AuthStore>((set)=>({
    setAuth : (input: SetAuthInput) => {
        set(input)
    }
}))