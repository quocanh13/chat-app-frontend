import type z from "zod";
import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant"
import { ApiError } from "../../shared/types";
import { GetMyGroupListSchema, GetUserDataSchema } from "./user.dto";

interface GetUserByIdInput{
    userId: number
}

type GetUserByIdData = z.infer<typeof GetUserDataSchema>
type GetMyGroupListData = z.infer<typeof GetMyGroupListSchema>

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
    console.log(result)
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetUserDataSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}

export async function getMyGroupList() : Promise<GetMyGroupListData> {
    const options: RequestInit = {
        method: "GET"
    }
    const response = await request(API_ENDPOINTS.USER.GET_MY_GROUP_LIST, options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetMyGroupListSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}