import {z} from "zod"

export const MessageSchema = z.object({
    userId: z.int().positive(),
    groupId: z.int().positive(),
    content: z.string(),
    fileId: z.int().positive().nullable(),
    sentAt: z.coerce.date()
})

export const GetMessageDataSchema = z.array(MessageSchema)