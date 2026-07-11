import { create } from "zustand";
import { type Message } from "../features/chat/message.dto";

interface MessageStack{
    groupId: number,
    messages: Message[]
} []

interface AddMessageInput{
    groupId: number,
    messages: Message[],
    before?: boolean
    newGroup?: boolean
}

interface ChatStore{
    currentGroupId: number | null,
    setCurrentGroupId: (id: number | null) => void,

    searchTerm: string,
    setSearchTerm : (searchTerm: string) => void,

    messageStack: MessageStack[],
    getMessageStack: (groupId: number) => Message[] | null,
    addMessageStack: (input: AddMessageInput) => void,

    currentGroupMessages: Message[] | null
}

export const useChatStore = create<ChatStore>((set, get) => ({
    currentGroupId : null,
    setCurrentGroupId(id) { 
        if(id == null)
            set({currentGroupId: id, currentGroupMessages: null})
        else
            set({currentGroupId: id, currentGroupMessages: get().getMessageStack(id)}) 
    },

    searchTerm: "",
    setSearchTerm(searchTerm) { set({searchTerm}) },

    messageStack: [],
    getMessageStack(groupId) {
        const { messageStack } = get()
        for(let i = 0; i < messageStack.length; i++){
            const s = messageStack[i]
            if(s.groupId == groupId){
                messageStack[i] = messageStack[0]
                messageStack[0] = s
                return s.messages
            }
        }
        return null
    },
    addMessageStack(input) {
        let added = false
        const { messageStack } = get()
        let newStack = messageStack.map((s)=>{
            if(s.groupId == input.groupId){
                if(input.before) s.messages = [...input.messages, ...s.messages]
                else s.messages = [...s.messages, ...input.messages]
                added = true
            }
            return s
        })
        if(input.newGroup && added === false){
            if(newStack.length >= 10)
                newStack.pop()
            newStack = [{groupId: input.groupId, messages: input.messages}, ...newStack]
        }

        for(const s of newStack){
            if(s.groupId == get().currentGroupId){
                set({currentGroupMessages: s.messages})
            }
        }

        set({messageStack: newStack})
    },

    currentGroupMessages: null
}))