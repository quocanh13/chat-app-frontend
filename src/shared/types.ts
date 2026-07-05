
export type ApiResponse<Data = undefined> = {
    data?: Data,
    code?: string,
    message?: string,
    detail?: Record<string, string[]> 
}

export class ApiError extends Error{
    constructor(message?: string, code?: string, detail?: Record<string, string[]>){
        super(message? message : "Server Error")
        this.name = "ApiError"
        this.code = code? code : "SERVER_ERROR"
        this.detail = detail
    }

    detail?: Record<string, string[]>
    code: string
}

export const TOAST_TYPE = {
    SUCCESS: 0,
    ERROR: 1,
    NOTIFICATION: 2,
} as const;
export type ToastType = typeof TOAST_TYPE[keyof typeof TOAST_TYPE];

export type Toast = {
    id: number,
    type?: ToastType,
    message?: string,
    closeTime: number | null
}