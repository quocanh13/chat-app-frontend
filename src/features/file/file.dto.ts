import {z} from "zod"

export const PostFileResponseDataSchema = z.object({
    id: z.int().positive()
})

export const GetFileResponseDataSchema = z.object({
    id: z.int().positive(),
    name: z.string(),
    mimeType: z.string(),
    size: z.int().nonnegative()
})