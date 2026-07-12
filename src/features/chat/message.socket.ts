import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../../stores/chatStore";
import { MessageSchema } from "./message.dto";
import { type GroupData } from "./group.dto";

export function useMessageSocket(){
    const { addMessageStack } = useChatStore()
    const queryClient = useQueryClient()

    function onNewMessage(data: any){
        const dto = MessageSchema.safeParse(data)
        if(!dto.success){
            console.log(dto.error.flatten())
            return
        }

        const message = dto.data
        addMessageStack({
            groupId: message.groupId,
            messages : [message],
            newGroup : false,
            after: true
        })
        queryClient.setQueryData<GroupData>(["group", message.groupId], (old)=>{
            if(old)
                return {...old, lastMessage: message}
        })
    }

    return {onNewMessage}
}