import { useEffect } from "react";
import { useMessageSocket } from "../chat/message.socket";
import { socket } from "./socket";
import { useGroupSocket } from "../chat/group.socket";

export function useSocket(){
    const { onNewMessage } = useMessageSocket()
    const { onNewMember, onNewGroup, onDeleteMember, onDeleteGroup } = useGroupSocket()
    useEffect(()=>{
        console.log("Attach socket handler")
        socket.on("message:new", onNewMessage)
        socket.on("group:new-member", onNewMember)
        socket.on("group:new", onNewGroup)
        socket.on("group:delete-member", onDeleteMember)
        socket.on("group:delete", onDeleteGroup)

        return () => {
            console.log("Remove socket handler")
            socket.off("message:new", onNewMessage)
            socket.off("group:new-member", onNewMember)
            socket.off("group:new", onNewGroup)
            socket.off("group:delete", onDeleteGroup)
        }
    }, [])
}