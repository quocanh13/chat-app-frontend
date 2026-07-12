import { useEffect } from "react";
import { useMessageSocket } from "../chat/message.socket";
import { socket } from "./socket";

export function useSocket(){
    const { onNewMessage } = useMessageSocket()
    useEffect(()=>{
        console.log("Attach socket handler")
        socket.on("message:new", onNewMessage)

        return () => {
            console.log("Remove socket handler")
            socket.off("message:new", onNewMessage)
        }
    }, [])
}