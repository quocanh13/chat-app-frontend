import { useQuery } from "@tanstack/react-query"
import * as UserApi from "./user.api"
import { useEffect } from "react"
import { ApiError} from "../../shared/types"
import { useApiErrorHandler } from "../../lib/api"


export function useUser(){
    const { handleApiError } = useApiErrorHandler()

    const currentUserQuery = useQuery({
        queryKey: ["user", "me"],
        queryFn: UserApi.getMe
    })

    const currentUserGroupListQuery = useQuery({
        queryKey: ["group-list", "me"],
        queryFn: UserApi.getMyGroupList
    })

    useEffect(()=>{
        if(!currentUserQuery.isError)
            return
        const error = currentUserQuery.error as ApiError
        handleApiError(error)
    }, [currentUserQuery.isError])

    useEffect(()=>{

    })

    return {currentUserQuery}
}