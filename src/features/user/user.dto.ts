import {z} from "zod"
import { INVALID_SCHEMA_MESSAGE } from "../../shared/constant"

export const GetUserDataSchema = z.object({
    username: z.string(),
    name: z.string(),
    id: z.int().positive(),
    avatarFileId: z.int().positive().nullable(),
    email: z.email().nullable().optional()
})

export const UpdateUserFormSchema = z.object({
    name: z.string().trim()
            .min(1, INVALID_SCHEMA_MESSAGE.MIN_LENGTH("Name", 1))
            .max(50, INVALID_SCHEMA_MESSAGE.MAX_LENGTH("Name", 50))
            .regex(/^[\p{L}\s]+$/u, INVALID_SCHEMA_MESSAGE.NAME_REGEX)
            .optional(),
    email: z.email(INVALID_SCHEMA_MESSAGE.EMAIL)
            .nullable().optional()
})

export const UpdateUserResponseDataSchema = z.object({
    username: z.string(),
    name: z.string(),
    id: z.int().positive(),
    avatarFileId: z.int().positive().nullable(),
    email: z.email().nullable()
})

export type UserData = z.infer<typeof GetUserDataSchema>
export type UpdateUserFormData = z.infer<typeof UpdateUserFormSchema>