import {z} from "zod"
import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant";
import { ApiError } from "../../shared/types";
import { GetMyGroupListSchema, GroupSchema } from "./group.dto";

interface GetGroupByIdInput{
    groupId: number
}
interface CreateGroupInput{
    name: string
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
    if(!dto.success){
        console.log(dto.error.flatten())
        throw new ApiError()
    }

    return dto.data
}

export async function getGroupById(input: GetGroupByIdInput) {
    const options: RequestInit = {
        method: "GET"
    }
    const response = await request(API_ENDPOINTS.GROUP.GET_GROUP_BY_ID(input.groupId), options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GroupSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}

export async function createGroup(input: CreateGroupInput) {
    const options: RequestInit = {
        method: "POST",
        body : JSON.stringify({name: input.name}),
        headers : {
            "content-type" : "application/json"
        }
    }
    const response = await request(API_ENDPOINTS.GROUP.CREATE_GROUP, options);
    const result = await response.json()
    console.log(result)
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetMyGroupListSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data 
}