import { useQuery } from "@tanstack/react-query"
import * as UserApi from "./user.api"
import { useEffect } from "react"
import { ApiError} from "../../shared/types"
import { useApiErrorHandler } from "../../lib/api"


export function useCurrentUser(){
    const { handleApiError } = useApiErrorHandler()

    const currentUserQuery = useQuery({
        queryKey: ["user", "me"],
        queryFn: UserApi.getMe
    })

    useEffect(()=>{
        if(!currentUserQuery.isError)
            return
        const error = currentUserQuery.error as ApiError
        handleApiError(error)
    }, [currentUserQuery.isError])

    return {currentUserQuery, currentUser: currentUserQuery.data}
}

export function useUser(userId: number){
    const { handleApiError } = useApiErrorHandler()
    
    const userQuery = useQuery({
        queryKey: ["user", userId],
        queryFn(){
            return UserApi.getUserById({userId})
        }
    })

    useEffect(()=>{
        if(!userQuery.isError)
            return
        const error = userQuery.error as ApiError
        handleApiError(error)
    }, [userQuery.isError])

    return {userQuery, user: userQuery.data}
}