import { useQueryClient } from "@tanstack/react-query";
import { type GetMyGroupListData, type GroupData, GroupSchema, NewMemberSchema } from "./group.dto";
import { useToastStore } from "../../stores/toastStore";
import { TOAST_TYPE } from "../../shared/types";

export function useGroupSocket(){
    const queryClient = useQueryClient()
    const {addToast} = useToastStore()

    function onNewMember(data: any){
        const dto = NewMemberSchema.safeParse(data)
        if(!dto.success){
            console.log(dto.error.flatten())
            return
        } 
        console.log(dto.data)
        queryClient.setQueryData<GroupData>(["group", dto.data.groupId], (old)=>{
            if(old)
                return {...old, members: [...old.members, {userId: dto.data.userId, role: dto.data.role}]}
        })
    }

    function onNewGroup(data: any){
        const dto = GroupSchema.safeParse(data)
        if(!dto.success){
            console.log(dto.error.flatten())
            return
        } 

        addToast({type: TOAST_TYPE.NOTIFICATION, message: `You have just been added to the room "${dto.data.name}"`})

        queryClient.setQueryData<GetMyGroupListData>(["group-list", "me"], (old)=>{
            console.log(old)
            if(old)
                return {groups: [...old.groups, dto.data]}
        })
    }

    return {onNewMember, onNewGroup}
}