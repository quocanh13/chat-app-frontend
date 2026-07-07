import {z} from "zod";
import { INVALID_SCHEMA_MESSAGE } from "../../shared/constant";

export const RegisterFormSchema = z.object({
    username: z.string()
        .min(1, INVALID_SCHEMA_MESSAGE.MIN_LENGTH("Username", 1))
        .max(30, INVALID_SCHEMA_MESSAGE.MAX_LENGTH("Username", 30))
        .regex(/^[a-zA-Z0-9]+$/, INVALID_SCHEMA_MESSAGE.USERNAME_REGEX),
    password: z.string()
        .min(1, INVALID_SCHEMA_MESSAGE.MIN_LENGTH("Password", 1))
        .max(30, INVALID_SCHEMA_MESSAGE.MAX_LENGTH("Password", 30)),
    name: z.string().trim()
        .min(1, INVALID_SCHEMA_MESSAGE.MIN_LENGTH("Name", 1))
        .max(50, INVALID_SCHEMA_MESSAGE.MAX_LENGTH("Name", 50))
        .regex(/^[\p{L}\s]+$/u, INVALID_SCHEMA_MESSAGE.NAME_REGEX),
})

export const LoginFormSchema = z.object({
    username: z.string()
        .min(1, INVALID_SCHEMA_MESSAGE.MIN_LENGTH("Username", 1))
        .max(30, INVALID_SCHEMA_MESSAGE.MAX_LENGTH("Username", 30))
        .regex(/^[a-zA-Z0-9]+$/, INVALID_SCHEMA_MESSAGE.USERNAME_REGEX),
    password: z.string()
        .min(1, INVALID_SCHEMA_MESSAGE.MIN_LENGTH("Password", 1))
        .max(30, INVALID_SCHEMA_MESSAGE.MAX_LENGTH("Password", 30)),
})

export const LoginDataSchema = z.object({
    id: z.int().positive(),
    username: z.string(),
    token: z.string()
})