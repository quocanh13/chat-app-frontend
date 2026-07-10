import {z} from "zod"
import { MessageSchema } from "./message.dto";

export const GroupSchema = z.object({
    id: z.int().positive(),
    name: z.string(),
    lastMessage: MessageSchema.nullable(),
    avatarFileId: z.int().positive().nullable(),
    hostId: z.int().positive()
});

export const GetMyGroupListSchema = z.object({
    groups: z.array(GroupSchema)
})