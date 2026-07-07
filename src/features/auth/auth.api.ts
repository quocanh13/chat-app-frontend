import type z from "zod";
import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant"
import { ApiError } from "../../shared/types";
import { LoginDataSchema } from "./auth.dto";

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
type LoginData = z.infer<typeof LoginDataSchema>

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
    const dto = LoginDataSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}