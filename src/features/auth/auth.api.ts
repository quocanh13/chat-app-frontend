import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant"
import { ApiError } from "../../shared/types";

interface RegisterInput{
    username: string,
    password: string,
    name: string
}
interface LoginInput{
    username: string,
    password: string,
}

interface RegisterData{
    id: number
}
interface LoginData{
    token: string
}

export async function register(input: RegisterInput) : Promise<RegisterData> {
    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input)
    }
    const response = await request(API_ENDPOINTS.AUTH.REGISTER, options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    if(!result)
        throw new ApiError()

    return result as RegisterData
}

export async function login(input: LoginInput) : Promise<LoginData> {
    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input)
    }
    const response = await request(API_ENDPOINTS.AUTH.LOGIN, options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const data = result as LoginData
    if(!data?.token)
        throw new ApiError()

    return data
}