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

export const AddMemberFormSchema = z.object({
    username: z.string()
        .min(1, INVALID_SCHEMA_MESSAGE.MIN_LENGTH("Username", 1))
        .max(30, INVALID_SCHEMA_MESSAGE.MAX_LENGTH("Username", 30))
        .regex(/^[a-zA-Z0-9]+$/, INVALID_SCHEMA_MESSAGE.USERNAME_REGEX)
})

export const NewMemberSchema = z.object({
    groupId: z.int().positive(),
    userId: z.int().positive(),
    role: z.enum(["member", "host"])
})

export type GroupData = z.infer<typeof GroupSchema>
export type GetMyGroupListData = z.infer<typeof GetMyGroupListSchema>
export type AddMemberFormData = z.infer<typeof AddMemberFormSchema>