import {z} from "zod"

export const MessageFormSchema = z.object({
    content: z.string().max(2000),
    file: z.file()
})

export const MessageSchema = z.object({
    id: z.int().positive(), 
    userId: z.int().positive(),
    groupId: z.int().positive(),
    content: z.string(),
    fileId: z.int().positive().nullable(),
    sentAt: z.coerce.date()
})

export const SendMessageSchema = z.object({
    groupId: z.int().positive(),
    content: z.string(),
    fileId: z.int().positive().nullable()
})

export const GetMessageDataSchema = z.array(MessageSchema)

export type Message = z.infer<typeof MessageSchema>
export type MessageFormData = z.infer<typeof MessageFormSchema>