import type z from "zod";
import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant";
import { ApiError } from "../../shared/types";
import { GetFileResponseDataScheme, PostFileResponseDataSchema } from "./file.dto";

interface SendFileInput{
    file: File,
    type: "MESSAGE" | "USER_AVATAR" | "GROUP_AVATAR"
}
interface GetFileInformation{
    fileId: number
}

export async function sendFile(input: SendFileInput){
    const formData = new FormData()
    formData.append("file", input.file)
    formData.append("type", input.type)
    const options: RequestInit = {
        method: "POST",
        body : formData
    }
    const response = await request(API_ENDPOINTS.FILE.POST_FILE, options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = PostFileResponseDataSchema.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}
export async function getFileInformation(input: GetFileInformation) {
    const options: RequestInit = {
        method: "GET",
    }
    const response = await request(API_ENDPOINTS.FILE.GET_FILE(input.fileId), options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
    const dto = GetFileResponseDataScheme.safeParse(result)
    if(!dto.success)
        throw new ApiError()

    return dto.data
}