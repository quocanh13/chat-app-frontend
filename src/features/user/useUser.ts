import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as UserApi from "./user.api"
import { useEffect } from "react"
import { ApiError, TOAST_TYPE} from "../../shared/types"
import { useApiErrorHandler } from "../../lib/api"
import { useAuthStore } from "../../stores/authStore"
import { useToastStore } from "../../stores/toastStore"


export function useCurrentUser(){
    const { handleApiError } = useApiErrorHandler()
    const { token } = useAuthStore()

    const currentUserQuery = useQuery({
        queryKey: ["user", "me"],
        queryFn: UserApi.getMe,
        staleTime: Infinity
    })

    useEffect(()=>{
        if(!currentUserQuery.isError)
            return
        const error = currentUserQuery.error as ApiError
        handleApiError(error)
    }, [currentUserQuery.isError])

    useEffect(()=>{
        currentUserQuery.refetch()
    }, [token])

    return {currentUserQuery, currentUser: currentUserQuery.data}
}

export function useUser(userId: number | undefined){
    const { handleApiError } = useApiErrorHandler()
    
    const userQuery = useQuery({
        queryKey: ["user", userId],
        queryFn(){
            return UserApi.getUserById({userId: userId!})
        },
        enabled: userId !== undefined,
        staleTime: Infinity
    })

    useEffect(()=>{
        if(!userQuery.isError)
            return
        const error = userQuery.error as ApiError
        handleApiError(error)
    }, [userQuery.isError])

    return {userQuery, user: userQuery.data}
}

export function useUserMutation(){
    const { addToast } = useToastStore()
    const { handleApiError } = useApiErrorHandler()
    const queryClient = useQueryClient()

    const updateUserMutation = useMutation({
        mutationKey: ["update-user"],
        mutationFn: UserApi.updateUser,
        onSuccess(data){
            queryClient.setQueryData(["user", "me"], ()=>data)
            queryClient.setQueryData(["user", data.id], ()=>data)
            addToast({type: TOAST_TYPE.SUCCESS, message: "Update user information successfully"})
        },
        onError: handleApiError
    })

    return {updateUser: updateUserMutation.mutate}
}