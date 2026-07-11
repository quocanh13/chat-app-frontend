import {z} from "zod"

export const PostFileResponseDataSchema = z.object({
    id: z.int().positive()
})