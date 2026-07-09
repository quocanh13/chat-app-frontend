import {z} from "zod"

export const GetUserDataSchema = z.object({
    username: z.string(),
    name: z.string(),
    id: z.int().positive(),
    avatarFileId: z.int().positive().nullable()
})

