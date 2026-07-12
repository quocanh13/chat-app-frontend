import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
    withCredentials: true
});

socket.on("connect_error", (err)=>{
    console.log(err.message);
});