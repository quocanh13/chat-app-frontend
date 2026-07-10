import type z from "zod";
import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant"
import { ApiError } from "../../shared/types";
import { GetUserDataSchema } from "./user.dto";

interface GetUserByIdInput{
    userId: number
}

type GetUserByIdData = z.infer<typeof GetUserDataSchema>


export async function getUserById(input: GetUserByIdInput) : Promise<GetUserByIdData> {
    const options: RequestInit = {
        method: "GET"
    }
    const response = await request(API_ENDPOINTS.USER.GET_USER_BY_ID(input.userId), options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetUserDataSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}

export async function getMe() : Promise<GetUserByIdData> {
    const options: RequestInit = {
        method: "GET"
    }
    const response = await request(API_ENDPOINTS.USER.GET_ME, options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetUserDataSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}

