import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as GroupApi from "./group.api"
import { useEffect } from "react"
import { ApiError} from "../../shared/types"
import { useApiErrorHandler } from "../../lib/api"

interface UseGroupInput{
    groupId: number
}

export function useGroupList(){
    const queryClient = useQueryClient();
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

    useEffect(()=>{
        if(!currentUserGroupListQuery.data)
            return
        const groups = currentUserGroupListQuery.data.groups
        groups.forEach((group) => {
            queryClient.setQueryData(["group", group.id], group);
        });
    }, [currentUserGroupListQuery.data])

    return {currentUserGroupListQuery}
}

export function useGroup(input: UseGroupInput){
    const groupQuery = useQuery({
        queryKey: ["group", input.groupId],
        queryFn: () => { return GroupApi.getGroupById(input) }
    })

    return {groupQuery, group: groupQuery.data}
}