import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as GroupApi from "./group.api"
import { useEffect } from "react"
import { ApiError, TOAST_TYPE} from "../../shared/types"
import { useApiErrorHandler } from "../../lib/api"
import { useChatStore } from "../../stores/chatStore"
import { useToastStore } from "../../stores/toastStore"
import { useCurrentUser } from "../user/useUser"
import type { GetMyGroupListData, GroupData } from "./group.dto"

export function useGroupList(){
    const queryClient = useQueryClient();
    const { handleApiError } = useApiErrorHandler()
    const { setCurrentGroupId, currentGroupId } = useChatStore()

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
        enabled: !!groupId
    })

    return {groupQuery, group: groupQuery.data}
}

export function useGroupMutation(){
    const { handleApiError } = useApiErrorHandler()
    const { addToast } = useToastStore()
    const queryClient = useQueryClient()

    const groupMutation = useMutation({
        mutationKey: ["create-group"],
        mutationFn: GroupApi.createGroup,
        onSuccess(data) {
            queryClient.setQueryData(["group", data.id], data)
            queryClient.setQueryData<GetMyGroupListData>(["group-list", "me"], (old) => {
                if(old?.groups)
                    return {groups: [...old.groups, data]}
            })
            addToast({type: TOAST_TYPE.SUCCESS, message: "Create group successfully"})
        },
        onError: handleApiError
    })

    return {createGroup: groupMutation.mutate, isPending: groupMutation.isPending}
}