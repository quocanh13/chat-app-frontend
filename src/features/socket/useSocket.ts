import { useEffect } from "react";
import { useMessageSocket } from "../chat/message.socket";
import { socket } from "./socket";
import { useGroupSocket } from "../chat/group.socket";

export function useSocket(){
    const { onNewMessage } = useMessageSocket()
    const { onNewMember, onNewGroup } = useGroupSocket()
    useEffect(()=>{
        console.log("Attach socket handler")
        socket.on("message:new", onNewMessage)
        socket.on("group:new-member", onNewMember)
        socket.on("group:new", onNewGroup)

        return () => {
            console.log("Remove socket handler")
            socket.off("message:new", onNewMessage)
            socket.off("group:new-member", onNewMember)
            socket.off("group:new", onNewGroup)
        }
    }, [])
}