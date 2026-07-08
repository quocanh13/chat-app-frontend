import {z} from "zod"

export const GetUserDataSchema = z.object({
    username: z.string(),
    name: z.string(),
    id: z.int().positive(),
    avatarFileId: z.int().positive().nullable()
})

const GroupSchema = z.object({
    id: z.int().positive(),
    name: z.string(),
    lastMessageId: z.int().positive().nullable(),
    avatarFileId: z.int().positive().nullable()
});

export const GetMyGroupListSchema = z.object({
    groups: z.array(GroupSchema)
})