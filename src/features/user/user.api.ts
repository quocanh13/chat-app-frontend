import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant"
import { ApiError } from "../../shared/types";
import { GetUserDataSchema, UpdateUserResponseDataSchema } from "./user.dto";
import { sendFile } from "../file/file.api";

interface GetUserByIdInput{
    userId: number
}
interface UpdateUserInput{
    userId: number,
    name?: string | null,
    avatar?: File | null,
    email?: string | null
}


export async function getUserById(input: GetUserByIdInput) {
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

export async function getMe(){
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

export async function updateUser(input: UpdateUserInput) {
    let avatarFileId = null
    if(input.avatar)
        avatarFileId = (await sendFile({file: input.avatar, type: "USER_AVATAR"})).id

    const body = {
        name: input.name,
        email: input.email,
        avatarFileId
    }
    const options: RequestInit = {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            "content-type" : "application/json"
        }
    }
    const response = await request(API_ENDPOINTS.USER.PATCH_USER_BY_ID(input.userId), options);
    const result = await response.json()
    console.log(result)
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = UpdateUserResponseDataSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}