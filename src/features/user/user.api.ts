import type z from "zod";
import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant"
import { ApiError } from "../../shared/types";
import { GetGroupListSchema, GetUserDataSchema } from "./user.dto";

interface GetUserByIdInput{
    userId: number
}
interface GetGroupListInput{
    userId: number
}

type GetUserByIdData = z.infer<typeof GetUserDataSchema>
type GetGroupListData = z.infer<typeof GetGroupListSchema>

export async function getUserById(input: GetUserByIdInput) : Promise<GetUserByIdData> {
    const options: RequestInit = {
        method: "GET"
    }
    const response = await request(API_ENDPOINTS.AUTH.USER.GET_USER_BY_ID(input.userId), options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetUserDataSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}

export async function getGroupList(input: GetGroupListInput) : Promise<GetGroupListData> {
    const options: RequestInit = {
        method: "GET"
    }
    const response = await request(API_ENDPOINTS.AUTH.USER.GET_GROUP_LIST(input.userId), options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetGroupListSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}