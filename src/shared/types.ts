export type ServiceResult<Data = undefined> = {
    success: boolean,
    data?: Data,
    code?: string,
    message?: string,
    detail?: string
}

export type ApiResponse<Data = undefined> = {
    data?: Data,
    code?: string,
    message?: string,
    detail?: string  
}