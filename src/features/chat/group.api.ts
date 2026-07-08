import {z} from "zod"
import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant";
import { ApiError } from "../../shared/types";
import { GetMyGroupListSchema } from "./group.dto";

interface getGroupByIdInput{
    groupId: number
}

type GetMyGroupListData = z.infer<typeof GetMyGroupListSchema>

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

export async function getGroupById(input: getGroupByIdInput) {
    const options: RequestInit = {
        method: "GET"
    }
    const response = await request(API_ENDPOINTS.GROUP.GET_GROUP_BY_ID(input.groupId), options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetMyGroupListSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}