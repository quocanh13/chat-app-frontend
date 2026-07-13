import { io } from "socket.io-client";
import { useToastStore } from "../../stores/toastStore";

const MAX_ATTEMP = 10
const DELAY_TIME = 3000
let attemp = 0

export const socket = io("http://localhost:3000", {
    withCredentials: true,
    autoConnect: false
});

socket.on("connect_error", (err)=>{
    console.log(err.message);
    if(attemp >= MAX_ATTEMP)
        useToastStore.getState().addToast({message: "Failed to establish socket, please reload page to try again"})
    else{
        attemp++
        setTimeout(()=>socket.connect(), DELAY_TIME)
    }
});