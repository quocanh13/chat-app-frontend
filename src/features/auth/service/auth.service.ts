import { API_ENDPOINTS } from "../../../shared/constant"
import type { ApiResponse, ServiceResult } from "../../../shared/types";

interface RegisterInput{
    username: string,
    password: string,
    name: string
}

interface RegisterData{
    id: number
}

export async function register(input: RegisterInput) : Promise<ServiceResult<RegisterData>> {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input)
    });

    const result: ApiResponse = await response.json()
    return {success : response.ok, ...result}
}