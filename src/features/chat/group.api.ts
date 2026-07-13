import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant";
import { ApiError, type ApiResponse } from "../../shared/types";
import { sendFile } from "../file/file.api";
import {  GetMyGroupListSchema, GroupSchema, UpdateGroupResponseDataSchema, type GetMyGroupListData } from "./group.dto";

interface GetGroupByIdInput{
    groupId: number
}
interface CreateGroupInput{
    name: string
}
interface AddMemberInput{
    groupId: number,
    username: string
}
interface DeleteMemberInput{
    groupId: number,
    memberId: number
}
interface DeleteGroupInput{
    groupId: number
}
interface UpdateGroupInput{
    groupId: number,
    avatar?: File,
    name?: string
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
    const dto = GroupSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()
    return dto.data 
}
export async function addMember(input: AddMemberInput) {
    const options: RequestInit = {
        method: "POST",
        body : JSON.stringify({username: input.username}),
        headers : {
            "content-type" : "application/json"
        }
    }
    const response = await request(API_ENDPOINTS.GROUP.POST_MEMBER(input.groupId), options);
    if(!response.ok){
        const result = await response.json() as ApiResponse
        throw new ApiError(result.message!, result.error, result.detail)
    }
    return
}
export async function deleteMember(input: DeleteMemberInput) {
    const options: RequestInit = {
        method: "DELETE"
    }
    const response = await request(API_ENDPOINTS.GROUP.DELETE_MEMBER(input.groupId, input.memberId), options);
    if(!response.ok){
        const result = await response.json() as ApiResponse
        throw new ApiError(result.message!, result.error, result.detail)
    }
    return 
}
export async function deleteGroup(input: DeleteGroupInput) {
    const options: RequestInit = {
        method: "DELETE"
    }
    const response = await request(API_ENDPOINTS.GROUP.DELETE_GROUP(input.groupId), options);
    if(!response.ok){
        const result = await response.json() as ApiResponse
        throw new ApiError(result.message!, result.error, result.detail)
    }
    return 
}
export async function updateGroup(input: UpdateGroupInput) {
    let avatarFileId = null
    if(input.avatar)
        avatarFileId = (await sendFile({file: input.avatar, type: "USER_AVATAR"})).id
    const body = {
        name: input.name,
        avatarFileId
    }
    const options: RequestInit = {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            "content-type" : "application/json"
        }
    }
    const response = await request(API_ENDPOINTS.GROUP.PATCH_GROUP(input.groupId), options);
    const result = await response.json()
    console.log(result)
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = UpdateGroupResponseDataSchema.safeParse(result)
    console.log(dto.error?.flatten())
    if(!dto.success)
        throw new ApiError()

    return dto.data
}