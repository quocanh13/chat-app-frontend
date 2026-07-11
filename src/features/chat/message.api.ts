import type z from "zod";
import { request } from "../../lib/api";
import { API_ENDPOINTS } from "../../shared/constant";
import { ApiError } from "../../shared/types";
import { GetMessageDataSchema } from "./message.dto";

interface SendMessageInput{
    groupId: number,
    content: string,
    fileId: number | null,
}
interface GetMessageInput{
    groupId: number,
    offset: number,
    limit: number
}

type GetMessageData = z.infer<typeof GetMessageDataSchema>

export async function sendMessage(input: SendMessageInput){
    const options: RequestInit = {
        method: "POST",
        body : JSON.stringify(input),
        headers: {
            "content-type" : "application/json"
        }
    }
    const response = await request(API_ENDPOINTS.MESSAGE.POST_MESSAGE(input.groupId), options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)
}
export async function getMessage(input: GetMessageInput) : Promise<GetMessageData> {
    const options: RequestInit = {
        method: "GET",
    } 
    const response = await request(API_ENDPOINTS.MESSAGE.GET_MESSAGE_BY_GROUP_ID(input), options);
    const result = await response.json()
    if(!response.ok)
        throw new ApiError(result.message!, result.error, result.detail)

    const dto = GetMessageDataSchema.safeParse(result)
    if(!dto.success){
        console.log(dto.error)
        throw new ApiError()
    }

    return dto.data
}