import { useQuery } from "@tanstack/react-query"
import * as GroupApi from "./group.api"
import { useEffect } from "react"
import { ApiError} from "../../shared/types"
import { useApiErrorHandler } from "../../lib/api"


export function useGroup(){
    const { handleApiError } = useApiErrorHandler()

    const currentUserGroupListQuery = useQuery({
        queryKey: ["group-list", "me"],
        queryFn: GroupApi.getMyGroupList
    })

    useEffect(()=>{
        if(!currentUserGroupListQuery.isError)
            return
        const error = currentUserGroupListQuery.error as ApiError
        handleApiError(error)
    }, [currentUserGroupListQuery.isError])

    return {currentUserGroupListQuery}
}