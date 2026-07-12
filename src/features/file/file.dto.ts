import {z} from "zod"

export const PostFileResponseDataSchema = z.object({
    id: z.int().positive()
})

export const GetFileResponseDataSchema = z.object({
    id: z.int().positive(),
    name: z.string(),
    mimeType: z.string(),
    type: z.enum(["MESSAGE", "GROUP_AVATAR", "USER_AVATAR"]),
    size: z.int().nonnegative(),
    uploadedAt: z.coerce.date()
})