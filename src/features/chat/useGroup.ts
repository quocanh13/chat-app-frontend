import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as GroupApi from "./group.api"
import { useEffect } from "react"
import { ApiError} from "../../shared/types"
import { useApiErrorHandler } from "../../lib/api"
import { useGroupStore } from "../../stores/groupStore"

export function useGroupList(){
    const queryClient = useQueryClient();
    const { handleApiError } = useApiErrorHandler()
    const { setCurrentGroupId, currentGroupId } = useGroupStore()

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
        if(!currentGroupId && groups.length > 0)
            setCurrentGroupId(groups[0].id)
    }, [currentUserGroupListQuery.data])

    return {currentUserGroupListQuery, groupList : currentUserGroupListQuery.data?.groups}
}

export function useGroup(groupId: number | null | undefined){
    const groupQuery = useQuery({
        queryKey: ["group", groupId],
        queryFn: () => { return GroupApi.getGroupById({groupId: groupId!}) },
        enabled: !groupId
    })

    return {groupQuery, group: groupQuery.data}
}