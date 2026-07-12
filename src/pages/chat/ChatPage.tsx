import { Sidebar } from "../../features/chat/components/Sidebar";
import { ChatGroup } from "../../features/chat/components/ChatGroup";

import "./ChatPage.css";
import { useSocket } from "../../features/socket/useSocket";
import { useAuth } from "../../features/auth/useAuth";

export function ChatPage() {
    useSocket()
    return <div className="chat-page-container">
        <Sidebar />
        <ChatGroup />
    </div>
}