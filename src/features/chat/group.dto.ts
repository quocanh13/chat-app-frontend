import {z} from "zod"
import { MessageSchema } from "./message.dto";
import { INVALID_SCHEMA_MESSAGE } from "../../shared/constant";

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
    members: z.array(MemberSchema),
    createdAt: z.coerce.date()
});

export const GetMyGroupListSchema = z.object({
    groups: z.array(GroupSchema)
})

export const CreateGroupFormSchema = z.object({
    name: z.string()
            .min(0, INVALID_SCHEMA_MESSAGE.MIN_LENGTH("Group name", 0))
            .max(50, INVALID_SCHEMA_MESSAGE.MAX_LENGTH("Group name", 50))
})

export const CreateGroupResponseData = z.object({
    id: z.int().positive(),
    name: z.string()
})

export type GroupData = z.infer<typeof GroupSchema>
export type GetMyGroupListData = z.infer<typeof GetMyGroupListSchema>