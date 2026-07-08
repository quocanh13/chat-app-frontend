import { useQuery } from "@tanstack/react-query"
import * as UserApi from "./user.api"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToastStore } from "../../stores/toastStore"
import { ApiError, TOAST_TYPE } from "../../shared/types"


export function useUser(){
    const navigate = useNavigate()
    const { addToast } = useToastStore()

    const currentUserQuery = useQuery({
        queryKey: ["current-user"],
        queryFn: UserApi.getMe
    })

    useEffect(()=>{
        if(!currentUserQuery.isError)
            return
        const error = currentUserQuery.error as ApiError
        if(error.code == "TOKEN_NOT_FOUND" || error.code == "INVALID_TOKEN"){
            addToast({
                type: TOAST_TYPE.ERROR, 
                message: "Invalid token, redirecting to login page. Please login again"
            })
            navigate("/login")
        } else {
            addToast({
                type: TOAST_TYPE.ERROR, 
                message: "Unknown error"
            })
            console.log(error)
        }
    }, [currentUserQuery.isError])

    return {currentUserQuery}
}