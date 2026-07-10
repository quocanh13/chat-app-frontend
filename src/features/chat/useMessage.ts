import { useQuery } from "@tanstack/react-query";
import * as MessageApi from "./message.api"
import { useEffect, useRef, useState } from "react";
import z from "zod";
import type { MessageSchema } from "./message.dto";

type Message = z.infer<typeof MessageSchema>

export function useMessage(groupId: number){
    const offsetRef = useRef(0)
    const [messages, setMessages] = useState<Message[]>([])

    const messageQuery = useQuery({
        queryKey: ["message", groupId],
        queryFn(): Promise<Message[]> {
            return MessageApi.getMessage({ groupId, offset: offsetRef.current, limit: 20})
        }
    })

    useEffect(()=>{
        if(!messageQuery.data)
            return
        offsetRef.current += messageQuery.data.length
        setMessages(prev => ([...prev, ...messageQuery.data]))
    }, [messageQuery.data])

    return {messages, offsetRef, getMoreMessage: messageQuery.refetch}
}