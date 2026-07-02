import { useState } from "react"
import * as AuthService from "./auth.service"

interface RegisterInput{
    username: string,
    password: string,
    name: string
}

export function useAuth(){
    const [isLoading, setIsLoading] = useState(false)

    const register = async (input: RegisterInput) => {
        const registerResult = await AuthService.register(input)
        if(registerResult.success)
    }
}