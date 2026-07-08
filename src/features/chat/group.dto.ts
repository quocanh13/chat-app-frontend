import {z} from "zod"

const GroupSchema = z.object({
    id: z.int().positive(),
    name: z.string(),
    lastMessageId: z.int().positive().nullable(),
    avatarFileId: z.int().positive().nullable()
});

export const GetMyGroupListSchema = z.object({
    groups: z.array(GroupSchema)
})