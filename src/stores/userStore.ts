import { create } from "zustand";

interface User{
    id: number,
    username: string,
    name: string,
    avatarURL: string | null
}

interface UserStore{
    user?: User,
    setUser : (user: User) => void,
}

export const useUserStore = create<UserStore>((set)=>({
    setUser : (user: User) => {
        set({user})
    }
}))