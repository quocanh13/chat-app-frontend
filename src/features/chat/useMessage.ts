import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as MessageApi from "./message.api"
import * as FileApi from "../file/file.api"
import { useState } from "react";
import { useChatStore } from "../../stores/chatStore";
import { TOAST_TYPE, type ApiError } from "../../shared/types";
import { useApiErrorHandler } from "../../lib/api";

interface SendMessageInput{
    groupId: number,
    file?: File,
    content: string
}

export function useCurrentGroupMessage(){
    const { addMessageStack, currentGroupId, getMessageStack, currentGroupMessages } = useChatStore()
    const { handleApiError } = useApiErrorHandler()
    const [isLoading, setIsLoading] = useState(false)
    const queryClient = useQueryClient();

    const getMoreMessage = async () => {
        try{
            setIsLoading(true)
            const messages = await queryClient.fetchQuery({
                queryKey: ["message", currentGroupId],
                queryFn: () => {
                    const current = getMessageStack(currentGroupId!) ?? [];

                    return MessageApi.getMessage({
                        groupId: currentGroupId!,
                        offset: current.length,
                        limit: 20,
                    });
                },
            });

            addMessageStack({
                groupId: currentGroupId!,
                messages,
                newGroup: true,
            });
        } catch(e) {
            const error = e as ApiError
            console.log(error)
            handleApiError(error)
        } finally {
            setIsLoading(false)
        }
    };

    return {currentGroupMessages, getMoreMessage, isLoading}
}

export function useMessage(){
    const { currentGroupId } = useChatStore()
    const { handleApiError } = useApiErrorHandler()

    const sendMessageMutation = useMutation({
        mutationKey: ["send-message", currentGroupId],
        async mutationFn(input: SendMessageInput){
            let fileId : number | null = null
            if(input.file){
                const sendFileResutl = await FileApi.sendFile({file: input.file, type: "MESSAGE"})
                fileId = sendFileResutl.id
            }

            return MessageApi.sendMessage({...input, fileId})
        },
        onSuccess(data){
            console.log("Send message successfully")
        },
        onError : handleApiError
    })

    return {sendMessageMutation}
}