import { useQueryClient } from "@tanstack/react-query";
import { DeleteGrouprSchema, DeleteMemberSchema, type GetMyGroupListData, type GroupData, GroupSchema, NewMemberSchema } from "./group.dto";
import { useToastStore } from "../../stores/toastStore";
import { TOAST_TYPE } from "../../shared/types";
import { useChatStore } from "../../stores/chatStore";

export function useGroupSocket(){
    const queryClient = useQueryClient()
    const { addToast } = useToastStore()
    const { currentGroupId, setCurrentGroupId } = useChatStore()

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

    function onDeleteMember(data: any){
        const dto = DeleteMemberSchema.safeParse(data)
        if(!dto.success){
            console.log(dto.error.flatten())
            return
        }

        queryClient.setQueryData<GroupData>(["group", dto.data.groupId], (old)=>{
            if(!old) return old
            const members = old.members.filter((member) => member.userId != dto.data.memberId)
            return {...old, members}
        })
    }

    function onDeleteGroup(data: any){
        const dto = DeleteGrouprSchema.safeParse(data)
        if(!dto.success){
            console.log(dto.error.flatten())
            return
        }
        const group = queryClient.getQueryData<GroupData>(["group", dto.data.groupId])
        addToast({type: TOAST_TYPE.NOTIFICATION, message: `You have just been deleted from group "${group?.name}"`})
        setCurrentGroupId(null)
        console.log(currentGroupId)
        queryClient.setQueryData<GroupData>(["group", dto.data.groupId], () => undefined)
        queryClient.setQueryData<GetMyGroupListData>(["group-list", "me"], (old)=>{
            if(!old) return old
            const groups = old.groups.filter((group)=> group.id != dto.data.groupId)
            return {groups}
        })
    }

    return {onNewMember, onNewGroup, onDeleteMember, onDeleteGroup}
}