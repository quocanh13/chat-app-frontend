import {z} from "zod"
import { MessageSchema } from "./message.dto";

const MemberSchema = z.object({
    userId: z.int().positive(),
    role: z.enum(["host", "member"])
})

export const GroupSchema = z.object({
    id: z.int().positive(),
    name: z.string(),
    lastMessage: MessageSchema.nullable(),
    avatarFileId: z.int().positive().nullable(),
    hostId: z.int().positive(),
    members: z.array(MemberSchema)
});

export const GetMyGroupListSchema = z.object({
    groups: z.array(GroupSchema)
})